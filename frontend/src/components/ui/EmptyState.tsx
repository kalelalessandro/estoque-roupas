import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sunken text-ink/30">
        <Icon size={24} strokeWidth={1.6} />
      </div>
      <p className="text-sm font-medium text-ink/70">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-ink/45">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
