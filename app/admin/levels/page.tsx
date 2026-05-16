import { Save } from "lucide-react";
import { AdminRecord, AdminTable } from "@/components/admin/AdminTable";
import { DeleteSubmitButton } from "@/components/admin/DeleteSubmitButton";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { FormField, Input, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteLevelAction, upsertLevelAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/guards";
import { CORE_LEVEL_SLUGS } from "@/lib/utils/curriculum";
import type { GrammarLevel } from "@/types/database";

type AdminLevelsPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminLevelsPage({ searchParams }: AdminLevelsPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: levels } = await supabase
    .from("grammar_levels")
    .select("*")
    .in("slug", [...CORE_LEVEL_SLUGS])
    .order("level_order")
    .returns<GrammarLevel[]>();

  return (
    <>
      <PageHeader
        description="The academy path is intentionally limited to Beginner, Intermediate, and Advanced."
        eyebrow="Admin"
        title="Manage levels"
      />

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">Create missing core level</h2>
            <p className="mt-1 text-sm leading-6 text-body">Only beginner, intermediate, and advanced slugs are accepted.</p>
          </CardHeader>
          <CardContent>
            <form action={upsertLevelAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <FormField id="title" label="Title">
                <Input id="title" name="title" placeholder="Beginner" required />
              </FormField>
              <FormField id="slug" label="Slug" description="Leave blank to generate from the title.">
                <Input id="slug" name="slug" placeholder="beginner" />
              </FormField>
              <FormField id="description" label="Description">
                <Textarea id="description" name="description" placeholder="Short learner-facing description" />
              </FormField>
              <FormField id="level_order" label="Order">
                <Input defaultValue={1} id="level_order" min={1} name="level_order" type="number" />
              </FormField>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input className="h-4 w-4 accent-primary" defaultChecked name="is_published" type="checkbox" />
                Published
              </label>
              <SubmitButton loadingText="Saving">
                <Save className="h-4 w-4" />
                Save level
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <AdminTable description="Edit the three public curriculum levels without leaving this page." title="Levels">
            {(levels ?? []).map((level) => (
              <AdminRecord key={level.id}>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{level.title}</p>
                      <p className="text-sm text-muted">{level.slug}</p>
                    </div>
                    <Badge tone={level.is_published ? "green" : "gray"}>
                      {level.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </summary>
                <form action={upsertLevelAction} className="mt-4 grid gap-3 border-t border-line pt-4">
                  <input name="id" type="hidden" value={level.id} />
                  <FormField id={`title-${level.id}`} label="Title">
                    <Input defaultValue={level.title} id={`title-${level.id}`} name="title" required />
                  </FormField>
                  <FormField id={`slug-${level.id}`} label="Slug">
                    <Input defaultValue={level.slug} id={`slug-${level.id}`} name="slug" required />
                  </FormField>
                  <FormField id={`description-${level.id}`} label="Description">
                    <Textarea defaultValue={level.description ?? ""} id={`description-${level.id}`} name="description" />
                  </FormField>
                  <FormField id={`level-order-${level.id}`} label="Order">
                    <Input defaultValue={level.level_order} id={`level-order-${level.id}`} min={1} name="level_order" type="number" />
                  </FormField>
                  <label className="flex items-center gap-2 text-sm font-medium text-ink">
                    <input
                      className="h-4 w-4 accent-primary"
                      defaultChecked={level.is_published}
                      name="is_published"
                      type="checkbox"
                    />
                    Published
                  </label>
                  <div className="flex gap-2">
                    <SubmitButton loadingText="Updating" variant="secondary">
                      <Save className="h-4 w-4" />
                      Update
                    </SubmitButton>
                  </div>
                </form>
                <form action={deleteLevelAction} className="mt-3">
                  <input name="id" type="hidden" value={level.id} />
                  <DeleteSubmitButton label="Delete level" />
                </form>
              </AdminRecord>
            ))}
        </AdminTable>
      </div>
    </>
  );
}
