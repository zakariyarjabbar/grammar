import { Save, Trash2 } from "lucide-react";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteLevelAction, upsertLevelAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/guards";
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
    .order("level_order")
    .returns<GrammarLevel[]>();

  return (
    <>
      <PageHeader
        description="Create the high-level path from beginner to advanced."
        eyebrow="Admin"
        title="Manage levels"
      />

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">New level</h2>
          </CardHeader>
          <CardContent>
            <form action={upsertLevelAction} className="space-y-4">
              <AuthMessage message={params.message} />
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Beginner" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="beginner" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Short learner-facing description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level_order">Order</Label>
                <Input defaultValue={1} id="level_order" min={1} name="level_order" type="number" />
              </div>
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

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">Levels</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {(levels ?? []).map((level) => (
              <details className="rounded-2xl border border-line bg-secondary p-4" key={level.id}>
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
                  <Input defaultValue={level.title} name="title" required />
                  <Input defaultValue={level.slug} name="slug" required />
                  <Textarea defaultValue={level.description ?? ""} name="description" />
                  <Input defaultValue={level.level_order} min={1} name="level_order" type="number" />
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
