import Link from "next/link";
import { UserPlus } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input, Label } from "@/components/ui/Field";
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
    >
      <form action={signUpAction} className="space-y-4">
        <AuthMessage message={params.message} />
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input autoComplete="name" id="full_name" name="full_name" placeholder="Jane Learner" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input autoComplete="email" id="email" name="email" placeholder="you@example.com" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            autoComplete="new-password"
            id="password"
            minLength={6}
            name="password"
            placeholder="At least 6 characters"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirm password</Label>
          <PasswordInput
            autoComplete="new-password"
            id="confirm_password"
            minLength={6}
            name="confirm_password"
            placeholder="Repeat your password"
            required
          />
        </div>
        <SubmitButton className="w-full" loadingText="Creating account">
          <UserPlus className="h-4 w-4" />
          Create account
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
