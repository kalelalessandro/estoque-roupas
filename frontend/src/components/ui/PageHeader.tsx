import { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in-up sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-2xs font-semibold uppercase tracking-widest text-accent/70">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink/50">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
