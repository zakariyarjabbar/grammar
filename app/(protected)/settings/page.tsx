import { LogOut, Save, UserCircle } from "lucide-react";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signOutAction, updateProfileAction } from "@/lib/actions/auth";
import { requireUser } from "@/lib/auth/guards";
import type { GrammarLevel } from "@/types/database";

type SettingsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const { supabase, user, profile } = await requireUser();
  const { data: levels } = await supabase
    .from("grammar_levels")
    .select("*")
    .eq("is_published", true)
    .order("level_order")
    .returns<GrammarLevel[]>();

  return (
    <>
      <PageHeader
        description="Update your profile and choose the level shown on your dashboard."
        eyebrow="Settings"
        title="Profile settings"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-ink">Learner profile</h2>
            <p className="mt-1 text-base text-muted">Keep your account information and learning level up to date.</p>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="max-w-xl space-y-5">
              <AuthMessage message={params.message} />
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  defaultValue={profile?.full_name ?? ""}
                  id="full_name"
                  name="full_name"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_level_id">Current level</Label>
                <Select
                  defaultValue={profile?.current_level_id ?? ""}
                  id="current_level_id"
                  name="current_level_id"
                >
                  <option value="">Select a level</option>
                  {(levels ?? []).map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.title}
                    </option>
                  ))}
                </Select>
              </div>
              <SubmitButton loadingText="Saving">
                <Save className="h-4 w-4" />
                Save settings
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <UserCircle className="mb-4 h-8 w-8 text-primary" />
              <h2 className="text-lg font-semibold text-ink">Account information</h2>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <div className="rounded-2xl border border-line bg-secondary p-4">
                  <p className="font-semibold text-ink">Email</p>
                  <p className="mt-1 break-words">{user.email}</p>
                </div>
                <div className="rounded-2xl border border-line bg-secondary p-4">
                  <p className="font-semibold text-ink">Role</p>
                  <p className="mt-1 capitalize">{profile?.role ?? "user"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-ink">Session</h2>
              <p className="mt-2 text-base leading-7 text-muted">Sign out when you are finished studying.</p>
              <form action={signOutAction} className="mt-5">
                <SubmitButton loadingText="Signing out" variant="secondary">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
