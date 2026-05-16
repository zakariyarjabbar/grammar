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
import { deleteLessonAction, upsertLessonAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/guards";
import { jsonArray } from "@/lib/utils/content";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
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
    supabase
      .from("grammar_levels")
      .select("*")
      .in("slug", [...CORE_LEVEL_SLUGS])
      .order("level_order")
      .returns<GrammarLevel[]>(),
    supabase.from("grammar_topics").select("*").order("topic_order").returns<GrammarTopic[]>(),
    supabase.from("lessons").select("*").order("lesson_order").returns<Lesson[]>()
  ]);
  const levelById = new Map((levels ?? []).map((level) => [level.id, level]));
  const topicLabel = (topic: GrammarTopic) => {
    const level = levelById.get(topic.level_id);
    return level ? `${level.title} / ${topic.title}` : topic.title;
  };
  const topicById = new Map((topics ?? []).map((topic) => [topic.id, topic]));
  const coreLevelIds = new Set((levels ?? []).map((level) => level.id));
  const visibleTopics = (topics ?? []).filter((topic) => coreLevelIds.has(topic.level_id));
  const visibleTopicIds = new Set(visibleTopics.map((topic) => topic.id));
  const searchTerm = params.search?.trim().toLowerCase() ?? "";
  const filteredLessons = (lessons ?? []).filter((lesson) => {
    const topic = topicById.get(lesson.topic_id);
    if (!visibleTopicIds.has(lesson.topic_id)) {
      return false;
    }
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
            <p className="mt-1 text-sm leading-6 text-body">Write the full academy lesson structure in learner-friendly sections.</p>
          </CardHeader>
          <CardContent>
            <form action={upsertLessonAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <div className="rounded-lg border border-line bg-secondary p-4">
                <h3 className="text-sm font-semibold uppercase tracking-normal text-primary">Lesson identity</h3>
                <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic_id">Level and topic</Label>
                <Select id="topic_id" name="topic_id" required>
                  {visibleTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topicLabel(topic)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Present simple" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="present-simple" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
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
                  <Label htmlFor="estimated_minutes">Estimated minutes</Label>
                  <Input
                    defaultValue={8}
                    id="estimated_minutes"
                    min={1}
                    name="estimated_minutes"
                    type="number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson_order">Lesson order</Label>
                <Input defaultValue={1} id="lesson_order" min={1} name="lesson_order" type="number" />
              </div>
                </div>
              </div>
              <div className="rounded-lg border border-line bg-secondary p-4">
                <h3 className="text-sm font-semibold uppercase tracking-normal text-primary">Teaching content</h3>
                <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" placeholder="A short learner-friendly summary." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  className="min-h-48"
                  id="explanation"
                  name="explanation"
                  placeholder="Teach the rule clearly with simple, serious language."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formula">Formula</Label>
                <Textarea id="formula" name="formula" placeholder="Subject + base verb / verb-s" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage_when">When to use it</Label>
                <Textarea id="usage_when" name="usage_when" placeholder="Explain the situations where this grammar is useful." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage_when_not">When not to use it</Label>
                <Textarea id="usage_when_not" name="usage_when_not" placeholder="Explain common situations where learners should avoid or be careful with it." />
              </div>
                </div>
              </div>
              <div className="rounded-lg border border-line bg-secondary p-4">
                <h3 className="text-sm font-semibold uppercase tracking-normal text-primary">Line-by-line sections</h3>
                <p className="mt-1 text-sm leading-6 text-muted">Use one item per line. Wrong vs correct lines should follow: Wrong: ... | Correct: ...</p>
                <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examples">Examples</Label>
                <Textarea className="min-h-44" id="examples" name="examples" placeholder="8-12 correct examples, one per line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="common_mistakes">Common mistakes</Label>
                <Textarea className="min-h-44" id="common_mistakes" name="common_mistakes" placeholder="6-10 realistic learner mistakes, one per line" />
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
                <Textarea id="short_notes" name="short_notes" placeholder="5-8 useful notes, one per line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mini_practice">Mini practice</Label>
                <Textarea id="mini_practice" name="mini_practice" placeholder="5-8 quick practice prompts, one per line" />
              </div>
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

        <AdminTable description="Search, filter, expand, edit, and publish lessons from one practical management view." title="Lessons">
            <form className="grid gap-3 rounded-lg border border-line bg-secondary p-4 md:grid-cols-4">
              <Input defaultValue={params.search ?? ""} name="search" placeholder="Search lessons" />
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
                <AdminRecord key={lesson.id}>
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
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`topic-${lesson.id}`}>Level and topic</Label>
                        <Select defaultValue={lesson.topic_id} id={`topic-${lesson.id}`} name="topic_id">
                          {visibleTopics.map((item) => (
                            <option key={item.id} value={item.id}>
                              {topicLabel(item)}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`difficulty-${lesson.id}`}>Difficulty</Label>
                        <Select defaultValue={lesson.difficulty} id={`difficulty-${lesson.id}`} name="difficulty">
                          {difficultyOptions.map((difficulty) => (
                            <option key={difficulty} value={difficulty}>
                              {difficulty}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${lesson.id}`}>Lesson title</Label>
                        <Input defaultValue={lesson.title} id={`title-${lesson.id}`} name="title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`slug-${lesson.id}`}>Slug</Label>
                        <Input defaultValue={lesson.slug} id={`slug-${lesson.id}`} name="slug" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`summary-${lesson.id}`}>Summary</Label>
                      <Textarea defaultValue={lesson.summary ?? ""} id={`summary-${lesson.id}`} name="summary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`explanation-${lesson.id}`}>Explanation</Label>
                      <Textarea className="min-h-48" defaultValue={lesson.explanation} id={`explanation-${lesson.id}`} name="explanation" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`formula-${lesson.id}`}>Formula</Label>
                      <Textarea defaultValue={lesson.formula ?? ""} id={`formula-${lesson.id}`} name="formula" />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`usage-when-${lesson.id}`}>When to use it</Label>
                        <Textarea defaultValue={lesson.usage_when ?? ""} id={`usage-when-${lesson.id}`} name="usage_when" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`usage-when-not-${lesson.id}`}>When not to use it</Label>
                        <Textarea defaultValue={lesson.usage_when_not ?? ""} id={`usage-when-not-${lesson.id}`} name="usage_when_not" />
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`examples-${lesson.id}`}>Examples</Label>
                        <Textarea defaultValue={jsonArray(lesson.examples).join("\n")} id={`examples-${lesson.id}`} name="examples" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`common-mistakes-${lesson.id}`}>Common mistakes</Label>
                        <Textarea
                          defaultValue={jsonArray(lesson.common_mistakes).join("\n")}
                          id={`common-mistakes-${lesson.id}`}
                          name="common_mistakes"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`wrong-correct-${lesson.id}`}>Wrong vs correct examples</Label>
                      <Textarea
                        defaultValue={jsonArray(lesson.wrong_correct_examples).join("\n")}
                        id={`wrong-correct-${lesson.id}`}
                        name="wrong_correct_examples"
                      />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`short-notes-${lesson.id}`}>Short notes</Label>
                        <Textarea defaultValue={jsonArray(lesson.short_notes).join("\n")} id={`short-notes-${lesson.id}`} name="short_notes" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`mini-practice-${lesson.id}`}>Mini practice</Label>
                        <Textarea defaultValue={jsonArray(lesson.mini_practice).join("\n")} id={`mini-practice-${lesson.id}`} name="mini_practice" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`order-${lesson.id}`}>Lesson order</Label>
                        <Input defaultValue={lesson.lesson_order} id={`order-${lesson.id}`} min={1} name="lesson_order" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`minutes-${lesson.id}`}>Estimated minutes</Label>
                      <Input
                        defaultValue={lesson.estimated_minutes}
                        id={`minutes-${lesson.id}`}
                        min={1}
                        name="estimated_minutes"
                        type="number"
                      />
                      </div>
                    </div>
                    <details className="rounded-lg border border-line bg-secondary p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-primary">Preview lesson sections</summary>
                      <div className="mt-4 grid gap-3 text-sm leading-6 text-body">
                        <p><span className="font-semibold text-ink">Summary:</span> {lesson.summary}</p>
                        <p><span className="font-semibold text-ink">Formula:</span> {lesson.formula}</p>
                        <p><span className="font-semibold text-ink">First example:</span> {jsonArray(lesson.examples)[0] ?? "No examples yet"}</p>
                      </div>
                    </details>
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
                    <DeleteSubmitButton label="Delete lesson" />
                  </form>
                </AdminRecord>
              );
            })}
        </AdminTable>
      </div>
    </>
  );
}
