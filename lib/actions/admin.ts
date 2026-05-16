"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { linesToJsonArray, slugify } from "@/lib/utils/content";
import { isCoreLevelSlug } from "@/lib/utils/curriculum";
import type { CurriculumDifficulty, QuestionScope, QuestionType } from "@/types/database";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formNullableString(formData: FormData, key: string) {
  const value = formString(formData, key);
  return value || null;
}

function formNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(formString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

async function requireAdminClient() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return supabase;
}

export async function upsertLevelAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formNullableString(formData, "id");
  const title = formString(formData, "title");
  const slug = formString(formData, "slug") || slugify(title);

  if (!title) {
    redirectWithMessage("/admin/levels", "Level title is required.");
  }

  if (!isCoreLevelSlug(slug)) {
    redirectWithMessage("/admin/levels", "The academy path only supports beginner, intermediate, and advanced.");
  }

  const payload = {
    title,
    slug,
    description: formNullableString(formData, "description"),
    level_order: formNumber(formData, "level_order", 1),
    is_published: formBoolean(formData, "is_published"),
    updated_at: new Date().toISOString()
  };

  const { error } = id
    ? await supabase.from("grammar_levels").update(payload).eq("id", id)
    : await supabase.from("grammar_levels").insert(payload);

  if (error) {
    redirectWithMessage("/admin/levels", error.message);
  }

  revalidatePath("/admin/levels");
  revalidatePath("/learn");
  redirectWithMessage("/admin/levels", id ? "Level updated." : "Level created.");
}

export async function deleteLevelAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formString(formData, "id");

  if (id) {
    await supabase.from("grammar_levels").delete().eq("id", id);
  }

  revalidatePath("/admin/levels");
  revalidatePath("/learn");
  redirectWithMessage("/admin/levels", "Level deleted.");
}

export async function upsertTopicAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formNullableString(formData, "id");
  const title = formString(formData, "title");
  const slug = formString(formData, "slug") || slugify(title);
  const levelId = formString(formData, "level_id");
  const { data: level } = await supabase
    .from("grammar_levels")
    .select("slug")
    .eq("id", levelId)
    .maybeSingle<{ slug: string }>();

  if (!level || !isCoreLevelSlug(level.slug)) {
    redirectWithMessage("/admin/topics", "Topics must belong to Beginner, Intermediate, or Advanced.");
  }

  const payload = {
    level_id: levelId,
    title,
    slug,
    description: formNullableString(formData, "description"),
    topic_order: formNumber(formData, "topic_order", 1),
    is_published: formBoolean(formData, "is_published"),
    updated_at: new Date().toISOString()
  };

  const { error } = id
    ? await supabase.from("grammar_topics").update(payload).eq("id", id)
    : await supabase.from("grammar_topics").insert(payload);

  if (error) {
    redirectWithMessage("/admin/topics", error.message);
  }

  revalidatePath("/admin/topics");
  revalidatePath("/learn");
  redirectWithMessage("/admin/topics", id ? "Topic updated." : "Topic created.");
}

export async function deleteTopicAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formString(formData, "id");

  if (id) {
    await supabase.from("grammar_topics").delete().eq("id", id);
  }

  revalidatePath("/admin/topics");
  revalidatePath("/learn");
  redirectWithMessage("/admin/topics", "Topic deleted.");
}

export async function upsertLessonAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formNullableString(formData, "id");
  const title = formString(formData, "title");
  const slug = formString(formData, "slug") || slugify(title);
  const topicId = formString(formData, "topic_id");
  const explanation = formString(formData, "explanation");
  const estimatedMinutes = formNumber(formData, "estimated_minutes", 8);
  const lessonOrder = formNumber(formData, "lesson_order", 1);

  if (!topicId || !title || !explanation) {
    redirectWithMessage("/admin/lessons", "Topic, lesson title, and explanation are required.");
  }

  const { data: topic } = await supabase
    .from("grammar_topics")
    .select("grammar_levels(slug)")
    .eq("id", topicId)
    .maybeSingle<{ grammar_levels: { slug: string } | null }>();

  if (!topic?.grammar_levels || !isCoreLevelSlug(topic.grammar_levels.slug)) {
    redirectWithMessage("/admin/lessons", "Lessons must belong to Beginner, Intermediate, or Advanced.");
  }

  if (estimatedMinutes < 1 || lessonOrder < 1) {
    redirectWithMessage("/admin/lessons", "Estimated minutes and lesson order must be positive numbers.");
  }

  const payload = {
    topic_id: topicId,
    title,
    slug,
    difficulty: (formString(formData, "difficulty") || "easy") as CurriculumDifficulty,
    summary: formNullableString(formData, "summary"),
    explanation,
    formula: formNullableString(formData, "formula"),
    usage_when: formNullableString(formData, "usage_when"),
    usage_when_not: formNullableString(formData, "usage_when_not"),
    examples: linesToJsonArray(formString(formData, "examples")),
    common_mistakes: linesToJsonArray(formString(formData, "common_mistakes")),
    wrong_correct_examples: linesToJsonArray(formString(formData, "wrong_correct_examples")),
    short_notes: linesToJsonArray(formString(formData, "short_notes")),
    mini_practice: linesToJsonArray(formString(formData, "mini_practice")),
    lesson_order: lessonOrder,
    estimated_minutes: estimatedMinutes,
    is_published: formBoolean(formData, "is_published"),
    updated_at: new Date().toISOString()
  };

  const { error } = id
    ? await supabase.from("lessons").update(payload).eq("id", id)
    : await supabase.from("lessons").insert(payload);

  if (error) {
    redirectWithMessage("/admin/lessons", error.message);
  }

  revalidatePath("/admin/lessons");
  revalidatePath("/learn");
  redirectWithMessage("/admin/lessons", id ? "Lesson updated." : "Lesson created.");
}

export async function deleteLessonAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formString(formData, "id");

  if (id) {
    await supabase.from("lessons").delete().eq("id", id);
  }

  revalidatePath("/admin/lessons");
  revalidatePath("/learn");
  redirectWithMessage("/admin/lessons", "Lesson deleted.");
}

export async function upsertQuestionAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formNullableString(formData, "id");
  const questionType = formString(formData, "question_type") as QuestionType;
  const rawOptions = linesToJsonArray(formString(formData, "options"));
  const options = questionType === "true_false" && rawOptions.length === 0 ? ["True", "False"] : rawOptions;
  const lessonId = formNullableString(formData, "lesson_id");
  let topicId = formNullableString(formData, "topic_id");
  const prompt = formString(formData, "prompt");
  const correctAnswer = formString(formData, "correct_answer");

  if (lessonId && !topicId) {
    const { data: lesson } = await supabase
      .from("lessons")
      .select("topic_id")
      .eq("id", lessonId)
      .maybeSingle<{ topic_id: string }>();
    topicId = lesson?.topic_id ?? null;
  }

  if (!lessonId && !topicId) {
    redirectWithMessage("/admin/questions", "Choose a lesson or topic for this question.");
  }

  if (topicId) {
    const { data: topic } = await supabase
      .from("grammar_topics")
      .select("grammar_levels(slug)")
      .eq("id", topicId)
      .maybeSingle<{ grammar_levels: { slug: string } | null }>();

    if (!topic?.grammar_levels || !isCoreLevelSlug(topic.grammar_levels.slug)) {
      redirectWithMessage("/admin/questions", "Questions must belong to Beginner, Intermediate, or Advanced.");
    }
  }

  if (!prompt || !correctAnswer) {
    redirectWithMessage("/admin/questions", "Prompt and correct answer are required.");
  }

  if (questionType === "multiple_choice" && options.length < 2) {
    redirectWithMessage("/admin/questions", "Multiple choice questions need at least two options.");
  }

  const payload = {
    lesson_id: lessonId,
    topic_id: topicId,
    question_type: questionType,
    difficulty: (formString(formData, "difficulty") || "easy") as CurriculumDifficulty,
    question_scope: (formString(formData, "question_scope") || "practice") as QuestionScope,
    prompt,
    options,
    correct_answer: correctAnswer,
    explanation: formNullableString(formData, "explanation"),
    wrong_answer_explanation: formNullableString(formData, "wrong_answer_explanation"),
    question_order: formNumber(formData, "question_order", 1),
    is_published: formBoolean(formData, "is_published"),
    updated_at: new Date().toISOString()
  };

  const { error } = id
    ? await supabase.from("questions").update(payload).eq("id", id)
    : await supabase.from("questions").insert(payload);

  if (error) {
    redirectWithMessage("/admin/questions", error.message);
  }

  revalidatePath("/admin/questions");
  revalidatePath("/practice");
  redirectWithMessage("/admin/questions", id ? "Question updated." : "Question created.");
}

export async function deleteQuestionAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = formString(formData, "id");

  if (id) {
    await supabase.from("questions").delete().eq("id", id);
  }

  revalidatePath("/admin/questions");
  revalidatePath("/practice");
  redirectWithMessage("/admin/questions", "Question deleted.");
}
