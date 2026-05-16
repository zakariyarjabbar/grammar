import { Save, Trash2 } from "lucide-react";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteTopicAction, upsertTopicAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/guards";
import type { GrammarLevel, GrammarTopic } from "@/types/database";

type AdminTopicsPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminTopicsPage({ searchParams }: AdminTopicsPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: levels }, { data: topics }] = await Promise.all([
    supabase.from("grammar_levels").select("*").order("level_order").returns<GrammarLevel[]>(),
    supabase.from("grammar_topics").select("*").order("topic_order").returns<GrammarTopic[]>()
  ]);
  const levelById = new Map((levels ?? []).map((level) => [level.id, level]));

  return (
    <>
      <PageHeader
        description="Group lessons under a level by grammar concept."
        eyebrow="Admin"
        title="Manage topics"
      />

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">New topic</h2>
          </CardHeader>
          <CardContent>
            <form action={upsertTopicAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <div className="space-y-2">
                <Label htmlFor="level_id">Level</Label>
                <Select id="level_id" name="level_id" required>
                  {(levels ?? []).map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Present tenses" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="present-tenses" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic_order">Order</Label>
                <Input defaultValue={1} id="topic_order" min={1} name="topic_order" type="number" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input className="h-4 w-4 accent-primary" defaultChecked name="is_published" type="checkbox" />
                Published
              </label>
              <SubmitButton loadingText="Saving">
                <Save className="h-4 w-4" />
                Save topic
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">Topics</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {(topics ?? []).map((topic) => (
              <details className="rounded-2xl border border-line bg-secondary p-4" key={topic.id}>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{topic.title}</p>
                      <p className="text-sm text-muted">{levelById.get(topic.level_id)?.title}</p>
                    </div>
                    <Badge tone={topic.is_published ? "green" : "gray"}>
                      {topic.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </summary>
                <form action={upsertTopicAction} className="mt-4 grid gap-3 border-t border-line pt-4">
                  <input name="id" type="hidden" value={topic.id} />
                  <Select defaultValue={topic.level_id} name="level_id">
                    {(levels ?? []).map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.title}
                      </option>
                    ))}
                  </Select>
                  <Input defaultValue={topic.title} name="title" required />
                  <Input defaultValue={topic.slug} name="slug" required />
                  <Textarea defaultValue={topic.description ?? ""} name="description" />
                  <Input defaultValue={topic.topic_order} min={1} name="topic_order" type="number" />
                  <label className="flex items-center gap-2 text-sm font-medium text-ink">
                    <input
                      className="h-4 w-4 accent-primary"
                      defaultChecked={topic.is_published}
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
                <form action={deleteTopicAction} className="mt-3">
                  <input name="id" type="hidden" value={topic.id} />
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
