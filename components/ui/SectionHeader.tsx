type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeader({ eyebrow, title, description, centered }: SectionHeaderProps) {
  return (
    <div className={centered ? "mx-auto mb-10 max-w-3xl text-center" : "mb-7 max-w-3xl"}>
      {eyebrow ? <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-normal text-ink sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-muted">{description}</p> : null}
    </div>
  );
}
