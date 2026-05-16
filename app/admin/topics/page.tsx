import { Save } from "lucide-react";
import { AdminRecord, AdminTable } from "@/components/admin/AdminTable";
import { DeleteSubmitButton } from "@/components/admin/DeleteSubmitButton";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { FormField, Input, Select, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteTopicAction, upsertTopicAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel, GrammarTopic } from "@/types/database";

type AdminTopicsPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminTopicsPage({ searchParams }: AdminTopicsPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: levels }, { data: topics }] = await Promise.all([
    supabase
      .from("grammar_levels")
      .select("*")
      .in("slug", [...CORE_LEVEL_SLUGS])
      .order("level_order")
      .returns<GrammarLevel[]>(),
    supabase.from("grammar_topics").select("*").order("topic_order").returns<GrammarTopic[]>()
  ]);
  const levelById = new Map((levels ?? []).map((level) => [level.id, level]));
  const coreLevelIds = new Set((levels ?? []).map((level) => level.id));
  const visibleTopics = (topics ?? []).filter((topic) => coreLevelIds.has(topic.level_id));

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
            <p className="mt-1 text-sm leading-6 text-body">Group lessons under the correct curriculum level.</p>
          </CardHeader>
          <CardContent>
            <form action={upsertTopicAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <FormField id="level_id" label="Level">
                <Select id="level_id" name="level_id" required>
                  {(levels ?? []).map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.title}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="title" label="Title">
                <Input id="title" name="title" placeholder="Present tenses" required />
              </FormField>
              <FormField id="slug" label="Slug" description="Leave blank to generate from the title.">
                <Input id="slug" name="slug" placeholder="present-tenses" />
              </FormField>
              <FormField id="description" label="Description">
                <Textarea id="description" name="description" />
              </FormField>
              <FormField id="topic_order" label="Order">
                <Input defaultValue={1} id="topic_order" min={1} name="topic_order" type="number" />
              </FormField>
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

        <AdminTable description="Search by browser find or filter topics by level using the level dropdown while editing." title="Topics">
            {visibleTopics.map((topic) => (
              <AdminRecord key={topic.id}>
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
                  <FormField id={`level-${topic.id}`} label="Level">
                  <Select defaultValue={topic.level_id} id={`level-${topic.id}`} name="level_id">
                    {(levels ?? []).map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.title}
                      </option>
                    ))}
                  </Select>
                  </FormField>
                  <FormField id={`title-${topic.id}`} label="Title">
                    <Input defaultValue={topic.title} id={`title-${topic.id}`} name="title" required />
                  </FormField>
                  <FormField id={`slug-${topic.id}`} label="Slug">
                    <Input defaultValue={topic.slug} id={`slug-${topic.id}`} name="slug" required />
                  </FormField>
                  <FormField id={`description-${topic.id}`} label="Description">
                    <Textarea defaultValue={topic.description ?? ""} id={`description-${topic.id}`} name="description" />
                  </FormField>
                  <FormField id={`order-${topic.id}`} label="Order">
                    <Input defaultValue={topic.topic_order} id={`order-${topic.id}`} min={1} name="topic_order" type="number" />
                  </FormField>
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
                  <DeleteSubmitButton label="Delete topic" />
                </form>
              </AdminRecord>
            ))}
        </AdminTable>
      </div>
    </>
  );
}
