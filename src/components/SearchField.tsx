import { Search, X } from 'lucide-react';

export interface SearchFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

/** iOS search field: magnifier, clear button when there is text. */
export const SearchField = ({ value, onChange, placeholder }: SearchFieldProps) => (
  <div role="search" className="flex h-10 items-center gap-2 rounded-control bg-raised px-3 focus-within:ring-2 focus-within:ring-brand-ink">
    <Search aria-hidden className="size-[18px] shrink-0 text-muted" />
    <input type="search" aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-full min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden" />
    {value && (
      <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="-mr-2 flex size-10 items-center justify-center">
        <span className="flex size-[18px] items-center justify-center rounded-chip bg-muted/60 text-surface">
          <X aria-hidden className="size-3" strokeWidth={3} />
        </span>
      </button>
    )}
  </div>
);
