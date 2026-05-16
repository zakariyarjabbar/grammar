import { Save, Trash2 } from "lucide-react";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteLessonAction, upsertLessonAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/guards";
import { jsonArray } from "@/lib/utils/content";
import type { GrammarLevel, GrammarTopic, Lesson } from "@/types/database";

type AdminLessonsPageProps = {
  searchParams: Promise<{
    message?: string;
    search?: string;
    topic?: string;
    difficulty?: string;
  }>;
};

const difficultyOptions = ["easy", "medium", "hard", "review"] as const;

export default async function AdminLessonsPage({ searchParams }: AdminLessonsPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: levels }, { data: topics }, { data: lessons }] = await Promise.all([
    supabase.from("grammar_levels").select("*").order("level_order").returns<GrammarLevel[]>(),
    supabase.from("grammar_topics").select("*").order("topic_order").returns<GrammarTopic[]>(),
    supabase.from("lessons").select("*").order("lesson_order").returns<Lesson[]>()
  ]);
  const levelById = new Map((levels ?? []).map((level) => [level.id, level]));
  const topicLabel = (topic: GrammarTopic) => {
    const level = levelById.get(topic.level_id);
    return level ? `${level.title} / ${topic.title}` : topic.title;
  };
  const topicById = new Map((topics ?? []).map((topic) => [topic.id, topic]));
  const searchTerm = params.search?.trim().toLowerCase() ?? "";
  const filteredLessons = (lessons ?? []).filter((lesson) => {
    const topic = topicById.get(lesson.topic_id);
    const matchesSearch = searchTerm
      ? lesson.title.toLowerCase().includes(searchTerm) ||
        lesson.summary?.toLowerCase().includes(searchTerm) ||
        topic?.title.toLowerCase().includes(searchTerm)
      : true;
    const matchesTopic = params.topic ? lesson.topic_id === params.topic : true;
    const matchesDifficulty = params.difficulty ? lesson.difficulty === params.difficulty : true;

    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  return (
    <>
      <PageHeader
        description="Lessons contain explanation, structure, usage guidance, examples, mistakes, mini practice, and summary."
        eyebrow="Admin"
        title="Manage lessons"
      />

      <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">New lesson</h2>
          </CardHeader>
          <CardContent>
            <form action={upsertLessonAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <div className="space-y-2">
                <Label htmlFor="topic_id">Topic</Label>
                <Select id="topic_id" name="topic_id" required>
                  {(topics ?? []).map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topicLabel(topic)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Present Simple" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="present-simple" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select defaultValue="easy" id="difficulty" name="difficulty">
                  {difficultyOptions.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">Simple explanation</Label>
                <Textarea id="explanation" name="explanation" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formula">Grammar formula</Label>
                <Input id="formula" name="formula" placeholder="Subject + base verb" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage_when">When to use it</Label>
                <Textarea id="usage_when" name="usage_when" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage_when_not">When not to use it</Label>
                <Textarea id="usage_when_not" name="usage_when_not" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examples">Examples</Label>
                <Textarea id="examples" name="examples" placeholder="One example per line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="common_mistakes">Common mistakes</Label>
                <Textarea id="common_mistakes" name="common_mistakes" placeholder="One mistake per line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrong_correct_examples">Wrong vs correct examples</Label>
                <Textarea
                  id="wrong_correct_examples"
                  name="wrong_correct_examples"
                  placeholder="Wrong: I is happy. | Correct: I am happy."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_notes">Short notes</Label>
                <Textarea id="short_notes" name="short_notes" placeholder="One note per line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mini_practice">Mini practice</Label>
                <Textarea id="mini_practice" name="mini_practice" placeholder="One mini prompt per line" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lesson_order">Order</Label>
                  <Input defaultValue={1} id="lesson_order" min={1} name="lesson_order" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_minutes">Minutes</Label>
                  <Input
                    defaultValue={8}
                    id="estimated_minutes"
                    min={1}
                    name="estimated_minutes"
                    type="number"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input className="h-4 w-4 accent-primary" defaultChecked name="is_published" type="checkbox" />
                Published
              </label>
              <SubmitButton loadingText="Saving">
                <Save className="h-4 w-4" />
                Save lesson
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">Lessons</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <form className="grid gap-3 rounded-2xl border border-line bg-secondary p-4 md:grid-cols-4">
              <Input defaultValue={params.search ?? ""} name="search" placeholder="Search lessons" />
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
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="secondary">Filter</Button>
            </form>
            {filteredLessons.map((lesson) => {
              const topic = topicById.get(lesson.topic_id);
              return (
                <details className="rounded-2xl border border-line bg-secondary p-4" key={lesson.id}>
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{lesson.title}</p>
                        <p className="text-sm text-muted">{topic ? topicLabel(topic) : "No topic"}</p>
                      </div>
                      <Badge tone={lesson.is_published ? "green" : "gray"}>
                        {lesson.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </summary>
                  <form action={upsertLessonAction} className="mt-4 grid gap-3 border-t border-line pt-4">
                    <input name="id" type="hidden" value={lesson.id} />
                    <Select defaultValue={lesson.topic_id} name="topic_id">
                      {(topics ?? []).map((item) => (
                        <option key={item.id} value={item.id}>
                          {topicLabel(item)}
                        </option>
                      ))}
                    </Select>
                    <Input defaultValue={lesson.title} name="title" required />
                    <Input defaultValue={lesson.slug} name="slug" required />
                    <Select defaultValue={lesson.difficulty} name="difficulty">
                      {difficultyOptions.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </Select>
                    <Textarea defaultValue={lesson.summary ?? ""} name="summary" />
                    <Textarea defaultValue={lesson.explanation} name="explanation" required />
                    <Input defaultValue={lesson.formula ?? ""} name="formula" />
                    <Textarea defaultValue={lesson.usage_when ?? ""} name="usage_when" />
                    <Textarea defaultValue={lesson.usage_when_not ?? ""} name="usage_when_not" />
                    <Textarea defaultValue={jsonArray(lesson.examples).join("\n")} name="examples" />
                    <Textarea
                      defaultValue={jsonArray(lesson.common_mistakes).join("\n")}
                      name="common_mistakes"
                    />
                    <Textarea
                      defaultValue={jsonArray(lesson.wrong_correct_examples).join("\n")}
                      name="wrong_correct_examples"
                    />
                    <Textarea defaultValue={jsonArray(lesson.short_notes).join("\n")} name="short_notes" />
                    <Textarea defaultValue={jsonArray(lesson.mini_practice).join("\n")} name="mini_practice" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input defaultValue={lesson.lesson_order} min={1} name="lesson_order" type="number" />
                      <Input
                        defaultValue={lesson.estimated_minutes}
                        min={1}
                        name="estimated_minutes"
                        type="number"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-ink">
                      <input
                        className="h-4 w-4 accent-primary"
                        defaultChecked={lesson.is_published}
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
                  <form action={deleteLessonAction} className="mt-3">
                    <input name="id" type="hidden" value={lesson.id} />
                    <Button type="submit" variant="danger">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </form>
                </details>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
