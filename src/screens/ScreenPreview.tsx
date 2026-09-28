import { useLayoutEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../app/App';
import type { Scenario } from '../data/types';
import { useStore } from '../store/useStore';

export interface ScreenArgs {
  path: string;
  scenario: Scenario;
  /** Owner has an installer linked (off → "Find an installer nearby") */
  installerLinked?: boolean;
}

export const seedScreen = ({ path, scenario, installerLinked = true }: ScreenArgs) => {
  const st = useStore.getState();
  st.loadScenario(scenario);
  st.setPrefs({ installerLinked });
  st.setRole(path.startsWith('/i') ? 'installer' : 'owner');
  // Skip the 600 ms loading skeletons in previews
  ['home', 'energy', 'panels', 'sites', 'alerts', 'site-maya', 'site-okafor', 'site-fernandez'].forEach(st.markLoaded);
};

/** A real app screen inside the phone frame, for Storybook. Built only from the components in the design system. */
export const ScreenPreview = ({ path, scenario, installerLinked = true }: ScreenArgs) => {
  // Re-seed when the scenario is changed in Controls
  useLayoutEffect(() => seedScreen({ path, scenario, installerLinked }), [path, scenario, installerLinked]);
  return (
    <MemoryRouter key={`${path}-${scenario}-${installerLinked}`} initialEntries={[path]}>
      <AppRoutes bare />
    </MemoryRouter>
  );
};
