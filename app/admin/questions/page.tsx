import { Save, Trash2 } from "lucide-react";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteQuestionAction, upsertQuestionAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/guards";
import { optionArray } from "@/lib/utils/content";
import type { CurriculumDifficulty, GrammarLevel, GrammarTopic, Lesson, Question, QuestionScope, QuestionType } from "@/types/database";

type AdminQuestionsPageProps = {
  searchParams: Promise<{
    message?: string;
    search?: string;
    level?: string;
    topic?: string;
    difficulty?: CurriculumDifficulty;
    type?: QuestionType;
  }>;
};

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "fill_blank", label: "Fill in the blank" },
  { value: "true_false", label: "True or false" },
  { value: "sentence_correction", label: "Sentence correction" }
];

const difficultyOptions: { value: CurriculumDifficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "review", label: "Review" }
];

const questionScopes: { value: QuestionScope; label: string }[] = [
  { value: "practice", label: "Practice" },
  { value: "lesson_test", label: "Lesson test" },
  { value: "mistake_focus", label: "Mistake focus" },
  { value: "topic_test", label: "Topic test" },
  { value: "level_test", label: "Level test" },
  { value: "mixed_test", label: "Mixed test" },
  { value: "final_exam", label: "Final exam" }
];

export default async function AdminQuestionsPage({ searchParams }: AdminQuestionsPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: levels }, { data: topics }, { data: lessons }, { data: questions }] = await Promise.all([
    supabase.from("grammar_levels").select("*").order("level_order").returns<GrammarLevel[]>(),
    supabase.from("grammar_topics").select("*").order("topic_order").returns<GrammarTopic[]>(),
    supabase.from("lessons").select("*").order("lesson_order").returns<Lesson[]>(),
    supabase.from("questions").select("*").order("question_order").returns<Question[]>()
  ]);
  const lessonById = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson]));
  const topicById = new Map((topics ?? []).map((topic) => [topic.id, topic]));
  const levelById = new Map((levels ?? []).map((level) => [level.id, level]));
  const topicLabel = (topic: GrammarTopic) => {
    const level = levelById.get(topic.level_id);
    return level ? `${level.title} / ${topic.title}` : topic.title;
  };
  const searchTerm = params.search?.trim().toLowerCase() ?? "";
  const filteredQuestions = (questions ?? []).filter((question) => {
    const lesson = question.lesson_id ? lessonById.get(question.lesson_id) : null;
    const topic = question.topic_id
      ? topicById.get(question.topic_id)
      : lesson
        ? topicById.get(lesson.topic_id)
        : null;
    const matchesSearch = searchTerm
      ? question.prompt.toLowerCase().includes(searchTerm) ||
        question.correct_answer.toLowerCase().includes(searchTerm) ||
        lesson?.title.toLowerCase().includes(searchTerm) ||
        topic?.title.toLowerCase().includes(searchTerm)
      : true;
    const matchesLevel = params.level ? topic?.level_id === params.level : true;
    const matchesTopic = params.topic ? topic?.id === params.topic : true;
    const matchesDifficulty = params.difficulty ? question.difficulty === params.difficulty : true;
    const matchesType = params.type ? question.question_type === params.type : true;

    return matchesSearch && matchesLevel && matchesTopic && matchesDifficulty && matchesType;
  });

  return (
    <>
      <PageHeader
        description="Attach questions to lessons for automatic progress tracking, or to topics for broader practice."
        eyebrow="Admin"
        title="Manage questions"
      />

      <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">New question</h2>
          </CardHeader>
          <CardContent>
            <form action={upsertQuestionAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <div className="space-y-2">
                <Label htmlFor="lesson_id">Lesson</Label>
                <Select id="lesson_id" name="lesson_id">
                  <option value="">No lesson</option>
                  {(lessons ?? []).map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic_id">Topic</Label>
                <Select id="topic_id" name="topic_id">
                  <option value="">No topic</option>
                  {(topics ?? []).map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topicLabel(topic)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question_type">Type</Label>
                <Select id="question_type" name="question_type">
                  {questionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select defaultValue="easy" id="difficulty" name="difficulty">
                    {difficultyOptions.map((difficulty) => (
                      <option key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question_scope">Scope</Label>
                  <Select defaultValue="practice" id="question_scope" name="question_scope">
                    {questionScopes.map((scope) => (
                      <option key={scope.value} value={scope.value}>
                        {scope.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea id="prompt" name="prompt" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="options">Options</Label>
                <Textarea id="options" name="options" placeholder="One option per line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correct_answer">Correct answer</Label>
                <Input id="correct_answer" name="correct_answer" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea id="explanation" name="explanation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrong_answer_explanation">Wrong answer explanation</Label>
                <Textarea id="wrong_answer_explanation" name="wrong_answer_explanation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="question_order">Order</Label>
                <Input defaultValue={1} id="question_order" min={1} name="question_order" type="number" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input className="h-4 w-4 accent-primary" defaultChecked name="is_published" type="checkbox" />
                Published
              </label>
              <SubmitButton loadingText="Saving">
                <Save className="h-4 w-4" />
                Save question
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">Questions</h2>
            <p className="mt-1 text-sm text-muted">Search and filter the curriculum question bank.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <form className="grid gap-3 rounded-2xl border border-line bg-secondary p-4 md:grid-cols-5">
              <Input defaultValue={params.search ?? ""} name="search" placeholder="Search questions" />
              <Select defaultValue={params.level ?? ""} name="level">
                <option value="">All levels</option>
                {(levels ?? []).map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.title}
                  </option>
                ))}
              </Select>
              <Select defaultValue={params.topic ?? ""} name="topic">
                <option value="">All topics</option>
                {(topics ?? []).map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topicLabel(topic)}
                  </option>
                ))}
              </Select>
              <Select defaultValue={params.difficulty ?? ""} name="difficulty">
                <option value="">All difficulty</option>
                {difficultyOptions.map((difficulty) => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </Select>
              <Select defaultValue={params.type ?? ""} name="type">
                <option value="">All types</option>
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="secondary">Filter</Button>
            </form>
            {filteredQuestions.map((question) => (
              <details className="rounded-2xl border border-line bg-secondary p-4" key={question.id}>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{question.prompt}</p>
                      <p className="mt-1 text-sm text-muted">
                        {question.lesson_id ? lessonById.get(question.lesson_id)?.title : "Topic question"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge tone="blue">{question.difficulty}</Badge>
                        <Badge tone="gray">{question.question_scope.replaceAll("_", " ")}</Badge>
                      </div>
                    </div>
                    <Badge tone={question.is_published ? "green" : "gray"}>
                      {question.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </summary>
                <form action={upsertQuestionAction} className="mt-4 grid gap-3 border-t border-line pt-4">
                  <input name="id" type="hidden" value={question.id} />
                  <Select defaultValue={question.lesson_id ?? ""} name="lesson_id">
                    <option value="">No lesson</option>
                    {(lessons ?? []).map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </Select>
                  <Select defaultValue={question.topic_id ?? ""} name="topic_id">
                    <option value="">No topic</option>
                    {(topics ?? []).map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topicLabel(topic)}
                      </option>
                    ))}
                  </Select>
                  <Select defaultValue={question.question_type} name="question_type">
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select defaultValue={question.difficulty} name="difficulty">
                      {difficultyOptions.map((difficulty) => (
                        <option key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </option>
                      ))}
                    </Select>
                    <Select defaultValue={question.question_scope} name="question_scope">
                      {questionScopes.map((scope) => (
                        <option key={scope.value} value={scope.value}>
                          {scope.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Textarea defaultValue={question.prompt} name="prompt" required />
                  <Textarea defaultValue={optionArray(question.options).join("\n")} name="options" />
                  <Input defaultValue={question.correct_answer} name="correct_answer" required />
                  <Textarea defaultValue={question.explanation ?? ""} name="explanation" />
                  <Textarea
                    defaultValue={question.wrong_answer_explanation ?? ""}
                    name="wrong_answer_explanation"
                  />
                  <Input defaultValue={question.question_order} min={1} name="question_order" type="number" />
                  <label className="flex items-center gap-2 text-sm font-medium text-ink">
                    <input
                      className="h-4 w-4 accent-primary"
                      defaultChecked={question.is_published}
                      name="is_published"
                      type="checkbox"
                    />
                    Published
                  </label>
                  <SubmitButton loadingText="Updating" variant="secondary">
                    <Save className="h-4 w-4" />
                    Update
                  </SubmitButton>
                </form>
                <form action={deleteQuestionAction} className="mt-3">
                  <input name="id" type="hidden" value={question.id} />
                  <Button type="submit" variant="danger">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </form>
              </details>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
