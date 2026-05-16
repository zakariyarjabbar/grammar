import { Save } from "lucide-react";
import { AdminRecord, AdminTable } from "@/components/admin/AdminTable";
import { DeleteSubmitButton } from "@/components/admin/DeleteSubmitButton";
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
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
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
    supabase
      .from("grammar_levels")
      .select("*")
      .in("slug", [...CORE_LEVEL_SLUGS])
      .order("level_order")
      .returns<GrammarLevel[]>(),
    supabase.from("grammar_topics").select("*").order("topic_order").returns<GrammarTopic[]>(),
    supabase.from("lessons").select("*").order("lesson_order").returns<Lesson[]>(),
    supabase.from("questions").select("*").order("question_order").returns<Question[]>()
  ]);
  const lessonById = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson]));
  const topicById = new Map((topics ?? []).map((topic) => [topic.id, topic]));
  const levelById = new Map((levels ?? []).map((level) => [level.id, level]));
  const coreLevelIds = new Set((levels ?? []).map((level) => level.id));
  const visibleTopics = (topics ?? []).filter((topic) => coreLevelIds.has(topic.level_id));
  const visibleTopicIds = new Set(visibleTopics.map((topic) => topic.id));
  const visibleLessons = (lessons ?? []).filter((lesson) => visibleTopicIds.has(lesson.topic_id));
  const visibleLessonIds = new Set(visibleLessons.map((lesson) => lesson.id));
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
    if (question.lesson_id && !visibleLessonIds.has(question.lesson_id)) {
      return false;
    }
    if (topic && !visibleTopicIds.has(topic.id)) {
      return false;
    }
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
            <p className="mt-1 text-sm leading-6 text-body">Attach questions to lessons or topics and choose the correct practice or test scope.</p>
          </CardHeader>
          <CardContent>
            <form action={upsertQuestionAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <div className="space-y-2">
                <Label htmlFor="level_id">Level</Label>
                <Select id="level_id" name="level_id">
                  <option value="">Choose from the three-level path</option>
                  {(levels ?? []).map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.title}
                    </option>
                  ))}
                </Select>
                <p className="text-sm leading-6 text-muted">Use the lesson or topic field below to attach the question to this level.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson_id">Lesson</Label>
                <Select id="lesson_id" name="lesson_id">
                  <option value="">No lesson</option>
                  {visibleLessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {topicById.get(lesson.topic_id) ? `${topicLabel(topicById.get(lesson.topic_id)!)} / ${lesson.title}` : lesson.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic_id">Topic</Label>
                <Select id="topic_id" name="topic_id">
                  <option value="">No topic</option>
                  {visibleTopics.map((topic) => (
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

        <AdminTable description="Search and filter the curriculum question bank." title="Questions">
            <form className="grid gap-3 rounded-lg border border-line bg-secondary p-4 md:grid-cols-5">
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
                {visibleTopics.map((topic) => (
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
              <AdminRecord key={question.id}>
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
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`level-${question.id}`}>Level</Label>
                      <Select
                        defaultValue={
                          question.topic_id
                            ? topicById.get(question.topic_id)?.level_id
                            : question.lesson_id
                              ? topicById.get(lessonById.get(question.lesson_id)?.topic_id ?? "")?.level_id
                              : ""
                        }
                        id={`level-${question.id}`}
                        name="level_id"
                      >
                        <option value="">Choose level</option>
                        {(levels ?? []).map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.title}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lesson-${question.id}`}>Lesson</Label>
                      <Select defaultValue={question.lesson_id ?? ""} id={`lesson-${question.id}`} name="lesson_id">
                        <option value="">No lesson</option>
                        {visibleLessons.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {topicById.get(lesson.topic_id) ? `${topicLabel(topicById.get(lesson.topic_id)!)} / ${lesson.title}` : lesson.title}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`topic-${question.id}`}>Topic</Label>
                      <Select defaultValue={question.topic_id ?? ""} id={`topic-${question.id}`} name="topic_id">
                        <option value="">No topic</option>
                        {visibleTopics.map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {topicLabel(topic)}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`type-${question.id}`}>Question type</Label>
                      <Select defaultValue={question.question_type} id={`type-${question.id}`} name="question_type">
                        {questionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`difficulty-${question.id}`}>Difficulty</Label>
                      <Select defaultValue={question.difficulty} id={`difficulty-${question.id}`} name="difficulty">
                        {difficultyOptions.map((difficulty) => (
                          <option key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`scope-${question.id}`}>Question scope</Label>
                      <Select defaultValue={question.question_scope} id={`scope-${question.id}`} name="question_scope">
                        {questionScopes.map((scope) => (
                          <option key={scope.value} value={scope.value}>
                            {scope.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`prompt-${question.id}`}>Prompt</Label>
                    <Textarea defaultValue={question.prompt} id={`prompt-${question.id}`} name="prompt" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`options-${question.id}`}>Options</Label>
                    <Textarea defaultValue={optionArray(question.options).join("\n")} id={`options-${question.id}`} name="options" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`answer-${question.id}`}>Correct answer</Label>
                    <Input defaultValue={question.correct_answer} id={`answer-${question.id}`} name="correct_answer" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`explanation-${question.id}`}>Explanation</Label>
                    <Textarea defaultValue={question.explanation ?? ""} id={`explanation-${question.id}`} name="explanation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`wrong-explanation-${question.id}`}>Wrong answer explanation</Label>
                    <Textarea
                      defaultValue={question.wrong_answer_explanation ?? ""}
                      id={`wrong-explanation-${question.id}`}
                      name="wrong_answer_explanation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`order-${question.id}`}>Order</Label>
                    <Input defaultValue={question.question_order} id={`order-${question.id}`} min={1} name="question_order" type="number" />
                  </div>
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
                  <DeleteSubmitButton label="Delete question" />
                </form>
              </AdminRecord>
            ))}
        </AdminTable>
      </div>
    </>
  );
}
