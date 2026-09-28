import { cx } from '../lib/cx';

export interface SkeletonProps {
  className?: string;
}

/** Placeholder block while data loads (600 ms). Pulses opacity only. */
export const Skeleton = ({ className }: SkeletonProps) => <div aria-hidden className={cx('skeleton rounded-control bg-raised', className)} />;

/** Home-shaped skeleton: status card, hero, numbers */
export const SkeletonHome = () => (
  <div aria-hidden className="flex flex-col gap-3 px-4">
    <Skeleton className="h-16 rounded-card" />
    <Skeleton className="h-[300px] rounded-card" />
    <Skeleton className="h-28 rounded-card" />
  </div>
);
