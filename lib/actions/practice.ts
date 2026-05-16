"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeAnswer } from "@/lib/utils/content";
import type { Question } from "@/types/database";

export type SubmitAnswerResult = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
  completedLesson: boolean;
  error?: string;
};

export async function submitAnswerAction(input: {
  questionId: string;
  answer: string;
}): Promise<SubmitAnswerResult> {
  const answer = input.answer.trim();

  if (!answer) {
    return {
      isCorrect: false,
      correctAnswer: "",
      explanation: null,
      completedLesson: false,
      error: "Enter an answer before checking."
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isCorrect: false,
      correctAnswer: "",
      explanation: null,
      completedLesson: false,
      error: "You need to log in again."
    };
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .eq("id", input.questionId)
    .single<Question>();

  if (questionError || !question) {
    return {
      isCorrect: false,
      correctAnswer: "",
      explanation: null,
      completedLesson: false,
      error: "Question not found."
    };
  }

  const isCorrect = normalizeAnswer(answer) === normalizeAnswer(question.correct_answer);

  await supabase.from("user_answers").insert({
    user_id: user.id,
    question_id: question.id,
    lesson_id: question.lesson_id,
    answer,
    is_correct: isCorrect
  });

  if (!isCorrect) {
    await supabase.from("user_mistakes").insert({
      user_id: user.id,
      question_id: question.id,
      lesson_id: question.lesson_id,
      submitted_answer: answer,
      correct_answer: question.correct_answer
    });
  }

  let completedLesson = false;

  if (question.lesson_id) {
    const { data: lessonQuestions } = await supabase
      .from("questions")
      .select("id")
      .eq("lesson_id", question.lesson_id)
      .eq("is_published", true);

    const { data: answeredQuestions } = await supabase
      .from("user_answers")
      .select("question_id")
      .eq("user_id", user.id)
      .eq("lesson_id", question.lesson_id);

    const totalQuestions = lessonQuestions?.length ?? 0;
    const answeredCount = new Set(answeredQuestions?.map((row) => row.question_id)).size;
    completedLesson = totalQuestions > 0 && answeredCount >= totalQuestions;

    await supabase.from("user_lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: question.lesson_id,
        status: completedLesson ? "completed" : "in_progress",
        completed_at: completedLesson ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "user_id,lesson_id"
      }
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/mistakes");
  revalidatePath("/practice");

  return {
    isCorrect,
    correctAnswer: question.correct_answer,
    explanation: question.explanation,
    completedLesson
  };
}

export async function resolveMistakeAction(formData: FormData) {
  const mistakeId = formData.get("mistake_id");

  if (typeof mistakeId !== "string" || !mistakeId) {
    redirect("/mistakes");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("user_mistakes")
    .update({
      is_resolved: true,
      resolved_at: new Date().toISOString()
    })
    .eq("id", mistakeId)
    .eq("user_id", user.id);

  revalidatePath("/mistakes");
  redirect("/mistakes");
}
