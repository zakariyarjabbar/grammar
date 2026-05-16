import Link from "next/link";
import { UserPlus } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { FormField, Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signUpAction } from "@/lib/actions/auth";

type RegisterPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <AuthCard
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:text-primaryHover" href="/login">
            Log in
          </Link>
        </>
      }
      subtitle="Create your learner profile and start building stronger English grammar."
      title="Create account"
      visualItems={["Start from your level", "Learn step by step", "Practice with feedback", "Build strong grammar"]}
      visualSubtitle="Begin with your current level and follow a clean path through lessons, practice, and review."
      visualTitle="Build strong grammar from day one"
    >
      <form action={signUpAction} className="space-y-4">
        <AuthMessage message={params.message} />
        <FormField id="full_name" label="Full name">
          <Input autoComplete="name" id="full_name" name="full_name" placeholder="Jane Learner" />
        </FormField>
        <FormField id="email" label="Email">
          <Input autoComplete="email" id="email" name="email" placeholder="you@example.com" type="email" />
        </FormField>
        <FormField id="password" label="Password" description="Use at least 6 characters.">
          <PasswordInput
            autoComplete="new-password"
            id="password"
            minLength={6}
            name="password"
            placeholder="At least 6 characters"
            required
          />
        </FormField>
        <FormField id="confirm_password" label="Confirm password">
          <PasswordInput
            autoComplete="new-password"
            id="confirm_password"
            minLength={6}
            name="confirm_password"
            placeholder="Repeat your password"
            required
          />
        </FormField>
        <SubmitButton className="w-full" loadingText="Creating account">
          <UserPlus className="h-4 w-4" />
          Create account
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
