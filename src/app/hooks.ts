import { useEffect, useMemo } from 'react';
import { live } from '../data/live';
import { SYSTEMS } from '../data/systems';
import { useStore } from '../store/useStore';

export const LOADING_MS = 600;

/** Shows a skeleton the first time a screen opens in a session (simulated fetch) */
export function useFirstLoad(key: string) {
  const loaded = useStore((s) => !!s.loaded[key]);
  const markLoaded = useStore((s) => s.markLoaded);
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => markLoaded(key), LOADING_MS);
    return () => clearTimeout(t);
  }, [loaded, key, markLoaded]);
  return !loaded;
}

export const useSystem = () => SYSTEMS[useStore((s) => s.systemId)];

/** The "right now" snapshot for the selected system */
export const useLive = () => {
  const scenario = useStore((s) => s.scenario);
  const battery = useStore((s) => s.battery);
  const tariff = useStore((s) => s.tariff);
  const issue = useStore((s) => s.issue);
  const system = useSystem();
  // The cabin never has the issue; the scenario targets the home system
  const sysIssue = system.id === 'home' ? issue : { ...issue, status: 'none' as const };
  return useMemo(() => live({ scenario, system, battery, tariff, issue: sysIssue }), [scenario, system, battery, tariff, sysIssue.status]);
};
