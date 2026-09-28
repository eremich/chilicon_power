import { useEffect, useState } from 'react';
import { Sheet } from '../../components/Sheet';
import { SlotPicker } from '../../components/SlotPicker';
import { TextArea } from '../../components/TextArea';
import { Button } from '../../components/Button';
import { FIRMWARE, FLEET, MAYA_SITE, OLD_FIRMWARE, deviceIdOf, type Site } from '../../data/fleet';
import { roofPanels, type RoofCase } from '../../data/roof';
import { live } from '../../data/live';
import { DEFAULT_TARIFF, SYSTEMS } from '../../data/systems';
import type { Issue, SolarSystem } from '../../data/types';
import type { DeviceState } from '../../components/DeviceRow';
import { useStore } from '../../store/useStore';

export const useSite = (id?: string) => FLEET.find((s) => s.id === id);

/** A site as a solar system, so the owner-side live model can drive the installer's Overview */
export const systemOf = (site: Site): SolarSystem =>
  site.id === MAYA_SITE
    ? SYSTEMS.home
    : { id: 'home', name: site.customer, city: site.city, sizeKw: site.sizeKw, panels: site.panels, pairsPerRow: site.pairsPerRow, scale: site.sizeKw / SYSTEMS.home.sizeKw, firstDevice: site.firstDevice, gatewayId: site.gatewayId, installedOn: site.installedOn, batteryKwh: site.battery };

export const siteLive = (site: Site, issue: Issue, battery: boolean) =>
  live({
    scenario: site.problem?.tone === 'offline' ? 'offline' : 'default',
    system: systemOf(site),
    battery: site.id === MAYA_SITE ? battery : !!site.battery,
    tariff: DEFAULT_TARIFF,
    issue: site.id === MAYA_SITE ? issue : { ...issue, status: 'none' },
  });

export interface Device {
  pair: number;
  id: string;
  panels: [number, number];
  watts: number;
  firmware: string;
  lastSeen: string;
  state: DeviceState;
  restarting: boolean;
}

/** Microinverters of a site with their current state, including restarts and firmware updates made in this session */
export const useDevices = (site: Site | undefined): Device[] => {
  const issue = useStore((s) => s.issue);
  const restarting = useStore((s) => (site ? s.restarting[site.id] : undefined));
  const restarted = useStore((s) => (site ? s.restarted[site.id] : undefined)) ?? [];
  const updated = useStore((s) => (site ? !!s.firmwareUpdated[site.id] : false));
  if (!site) return [];
  const offline = site.problem?.tone === 'offline';
  const mayaOpen = site.id === MAYA_SITE && ['open', 'reported', 'visit'].includes(issue.status);
  const roof: RoofCase = offline ? 'gateway-offline' : mayaOpen ? 'issue' : 'normal';
  const panels = roofPanels(roof, 0.78, site.panels);
  return Array.from({ length: site.panels / 2 }, (_, i) => {
    const pair = i + 1;
    const a = panels[i * 2];
    const b = panels[i * 2 + 1];
    const weakPair = (mayaOpen && pair === issue.pair && !restarted.includes(pair)) || (site.problem?.panel && Math.ceil(site.problem.panel / 2) === pair);
    const isRestarting = restarting === pair;
    const state: DeviceState = offline || isRestarting ? 'offline' : weakPair ? 'low' : 'ok';
    return {
      pair,
      id: deviceIdOf(site, pair),
      panels: [a.n, b.n] as [number, number],
      watts: isRestarting ? 0 : (a.watts + b.watts) * (weakPair && site.id !== MAYA_SITE ? 0.85 : 1),
      firmware: !updated && pair <= site.oldFirmware ? OLD_FIRMWARE : FIRMWARE,
      lastSeen: offline ? '9:14 am' : isRestarting ? 'restarting' : weakPair && site.id === MAYA_SITE ? '11:40 am' : '1 min ago',
      state,
      restarting: isRestarting,
    };
  }).sort((x, y) => (x.state === y.state ? x.pair - y.pair : x.state === 'ok' ? 1 : y.state === 'ok' ? -1 : 0));
};

const DAYS = ['Fri, May 22', 'Sat, May 23', 'Mon, May 25', 'Tue, May 26'];
const SLOTS = [{ label: '8–10 am' }, { label: '9–11 am' }, { label: '12–2 pm', taken: true }, { label: '2–4 pm' }];

export const VisitSheet = ({ site, open, onClose }: { site: Site; open: boolean; onClose: () => void }) => {
  const scheduleVisit = useStore((s) => s.scheduleVisit);
  const toast = useStore((s) => s.toast);
  const [day, setDay] = useState(DAYS[1]);
  const [slot, setSlot] = useState<string>();
  useEffect(() => {
    if (open) setSlot(undefined);
  }, [open]);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      detent="large"
      title="Schedule a visit"
      description={`${site.customer} gets a notification with the time`}
      footer={
        <Button
          block
          disabled={!slot}
          onClick={() => {
            scheduleVisit(site.id, day.split(', ')[1], slot!);
            onClose();
            toast(`Visit booked. ${site.customer.split(' ')[0]} was notified`);
          }}
        >
          {slot ? `Book ${day.split(', ')[1]}, ${slot}` : 'Pick a time window'}
        </Button>
      }
    >
      <SlotPicker days={DAYS} slots={SLOTS} day={day} slot={slot} onDay={setDay} onSlot={setSlot} />
    </Sheet>
  );
};

export const ResolveSheet = ({ open, onClose, deviceId, onDone }: { open: boolean; onClose: () => void; deviceId: string; onDone: () => void }) => {
  const resolveIssue = useStore((s) => s.resolveIssue);
  const restarted = useStore((s) => (s.restarted[MAYA_SITE] ?? []).length > 0);
  const [note, setNote] = useState('');
  const [tried, setTried] = useState(false);
  useEffect(() => {
    if (open) {
      setNote(restarted ? `Restarted microinverter ${deviceId} remotely. Back online.` : '');
      setTried(false);
    }
  }, [open, restarted, deviceId]);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      detent="large"
      title="Resolve issue"
      description="Maya sees your note in her issue history"
      footer={
        <Button
          block
          onClick={() => {
            setTried(true);
            if (!note.trim()) return;
            resolveIssue(note.trim());
            onClose();
            onDone();
          }}
        >
          Resolve and notify owner
        </Button>
      }
    >
      <TextArea label="What did you do?" value={note} onChange={(e) => setNote(e.target.value)} error={tried && !note.trim() ? 'Add a short note so the owner knows what was fixed' : undefined} placeholder="For example: cleaned panel 7, replaced the microinverter" />
    </Sheet>
  );
};
