import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';

/** Small building blocks for MDX pages, styled with the Chilicon tokens themselves. */

export const Lead = ({ children }: { children: ReactNode }) => <p className="docs-lead max-w-3xl">{children}</p>;

export const DoDont = ({ tone, title, children }: { tone: 'do' | 'dont'; title: string; children: ReactNode }) => {
  const isDo = tone === 'do';
  return (
    <div className={`flex flex-1 flex-col gap-3 rounded-card border p-4 ${isDo ? 'border-ok/40 bg-ok/5' : 'border-late/40 bg-late/5'}`}>
      <div className={`flex items-center gap-2 ${isDo ? 'text-ok-ink' : 'text-late-ink'}`}>
        {isDo ? <Check aria-hidden className="size-4" strokeWidth={3} /> : <X aria-hidden className="size-4" strokeWidth={3} />}
        <strong className="text-body font-bold">{isDo ? 'Do' : "Don't"}</strong>
      </div>
      <div className="flex min-h-16 items-center justify-center rounded-control border border-line bg-surface p-4">{children}</div>
      <p className="text-body text-ink">{title}</p>
    </div>
  );
};

export const DoDontRow = ({ children }: { children: ReactNode }) => <div className="docs-row flex flex-col gap-4 sm:flex-row">{children}</div>;

export const DocCard = ({ title, children, href }: { title: string; children: ReactNode; href?: string }) => {
  const body = (
    <div className="flex h-full flex-col gap-1.5 rounded-card border border-line bg-surface p-4 transition-colors hover:bg-canvas">
      <strong className="text-body font-bold text-ink">{title}</strong>
      <span className="text-body text-muted">{children}</span>
    </div>
  );
  return href ? (
    <a href={href} target="_top" className="docs-card">
      {body}
    </a>
  ) : (
    body
  );
};

export const CardGrid = ({ children }: { children: ReactNode }) => <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;

/** A phone-width frame for showing components in context */
export const PhoneWidth = ({ children }: { children: ReactNode }) => <div className="w-[390px] max-w-full bg-canvas p-4">{children}</div>;
