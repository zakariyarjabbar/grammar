import { AlertTriangle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again or return to your dashboard.",
  actionHref,
  actionLabel = "Go back"
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-100 bg-errorSoft p-8 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-error">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-base leading-7 text-body">{description}</p>
      {actionHref ? (
        <div className="mt-5">
          <ButtonLink href={actionHref} variant="secondary">
            {actionLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
