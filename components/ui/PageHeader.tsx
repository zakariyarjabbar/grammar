type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-7 flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-normal text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-base leading-7 text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
