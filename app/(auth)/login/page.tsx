import Link from "next/link";
import { LogIn } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input, Label } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signInAction } from "@/lib/actions/auth";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthCard
      footer={
        <>
          New here?{" "}
          <Link className="font-medium text-primary hover:text-primaryHover" href="/register">
            Create an account
          </Link>
        </>
      }
      subtitle="Welcome back to your grammar workspace."
      title="Welcome back"
    >
      <form action={signInAction} className="space-y-4">
        <AuthMessage message={params.message} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input autoComplete="email" id="email" name="email" placeholder="you@example.com" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            autoComplete="current-password"
            id="password"
            name="password"
            placeholder="Your password"
            required
          />
        </div>
        <SubmitButton className="w-full" loadingText="Logging in">
          <LogIn className="h-4 w-4" />
          Log in
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
