import type { Meta, StoryObj } from '@storybook/react-vite';
import { SCENARIOS } from '../data/types';
import { ScreenPreview, seedScreen, type ScreenArgs } from './ScreenPreview';

const meta = {
  title: 'Screens/Homeowner',
  component: ScreenPreview,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  beforeEach: ({ args }) => seedScreen(args as ScreenArgs),
  argTypes: { scenario: { control: 'select', options: SCENARIOS }, path: { control: 'text' }, installerLinked: { control: 'boolean' } },
  args: { scenario: 'default', path: '/o' },
} satisfies Meta<typeof ScreenPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};
export const HomeIssue: Story = { args: { scenario: 'issue' } };
export const HomeNight: Story = { args: { scenario: 'night' } };
export const HomeOffline: Story = { args: { scenario: 'offline' } };
export const Energy: Story = { args: { path: '/o/energy' } };
export const Panels: Story = { args: { path: '/o/panels', scenario: 'issue' } };
export const PanelDetail: Story = { args: { path: '/o/panels/4', scenario: 'issue' } };
export const Profile: Story = { args: { path: '/o/profile' } };
export const HomeCloudy: Story = { args: { scenario: 'cloudy' } };
export const HomeNoBattery: Story = { args: { scenario: 'no-battery' } };
export const HomeNoTariff: Story = { args: { scenario: 'no-tariff' } };
export const HomeFirstData: Story = { args: { scenario: 'first-data' } };
export const HomeResolved: Story = { args: { scenario: 'resolved' } };
export const EnergyNight: Story = { args: { path: '/o/energy', scenario: 'night' } };
export const PanelDetailNoInstaller: Story = { args: { path: '/o/panels/4', scenario: 'issue', installerLinked: false } };
export const ProfileNoInstaller: Story = { args: { path: '/o/profile', installerLinked: false } };
