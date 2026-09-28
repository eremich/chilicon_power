import { BadgeCheck, Star } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { ListGroup, ListRow } from '../../components/ListRow';
import { useStore } from '../../store/useStore';

/** Certified Chilicon installers near the owner, for owners with no installer linked. Invented companies. */
const NEARBY = [
  { name: 'Sunline Solar', miles: 3.2, rating: 4.9, reviews: 212, next: 'Visits from May 22' },
  { name: 'Capitol Roof & Solar', miles: 5.8, rating: 4.7, reviews: 138, next: 'Visits from May 26' },
  { name: 'Delta Sun Works', miles: 9.4, rating: 4.6, reviews: 87, next: 'Visits from May 25' },
];

export const FindInstallerSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const toast = useStore((s) => s.toast);
  return (
    <Sheet open={open} onClose={onClose} detent="large" title="Certified installers nearby" description="They know Chilicon microinverters and can see your report">
      <ListGroup footer="Picking one sends them your report and links them to your system with full technical access. You can change access later in Profile.">
        {NEARBY.map((i) => (
          <ListRow
            key={i.name}
            leading={<BadgeCheck aria-hidden className="size-[22px] text-ok" strokeWidth={1.75} />}
            title={i.name}
            subtitle={
              <span className="flex items-center gap-1">
                <Star aria-hidden className="size-3 fill-current text-brand-ink" />
                {i.rating} ({i.reviews}) · {i.miles} mi · {i.next}
              </span>
            }
            onClick={() => {
              onClose();
              toast(`Request sent to ${i.name}`);
            }}
          />
        ))}
      </ListGroup>
    </Sheet>
  );
};
