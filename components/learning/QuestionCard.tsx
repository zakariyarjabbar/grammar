import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

type QuestionCardProps = {
  label: string;
  text: string;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

export function QuestionCard({
  label,
  text,
  selected,
  correct,
  wrong,
  disabled,
  onSelect
}: QuestionCardProps) {
  const Icon = correct ? CheckCircle2 : wrong ? XCircle : Circle;

  return (
    <button
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-left text-base font-medium text-ink shadow-sm shadow-slate-950/[0.02] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primaryVerySoft disabled:cursor-not-allowed disabled:hover:translate-y-0",
        selected && "border-primary bg-primarySoft text-primary ring-2 ring-primary/10",
        correct && "border-green-200 bg-successSoft text-green-800",
        wrong && "animate-soft-shake border-red-200 bg-errorSoft text-red-800"
      )}
      disabled={disabled}
      onClick={onSelect}
      type="button"
    >
      <Badge tone={correct ? "green" : wrong ? "red" : selected ? "blue" : "gray"}>{label}</Badge>
      <span className="flex-1">{text}</span>
      <Icon className="h-5 w-5 shrink-0" />
    </button>
  );
}
