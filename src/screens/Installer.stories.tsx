import type { Meta, StoryObj } from '@storybook/react-vite';
import { SCENARIOS } from '../data/types';
import { ScreenPreview, seedScreen, type ScreenArgs } from './ScreenPreview';

const meta = {
  title: 'Screens/Installer',
  component: ScreenPreview,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  beforeEach: ({ args }) => seedScreen(args as ScreenArgs),
  argTypes: { scenario: { control: 'select', options: SCENARIOS }, path: { control: 'text' } },
  args: { scenario: 'issue', path: '/i' },
} satisfies Meta<typeof ScreenPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sites: Story = {};
export const SitesEmpty: Story = { args: { scenario: 'empty-installer' } };
export const Alerts: Story = { args: { path: '/i/alerts' } };
export const SiteOverview: Story = { args: { path: '/i/sites/maya' } };
export const SiteTechnical: Story = { args: { path: '/i/sites/maya?tab=technical' } };
export const Device: Story = { args: { path: '/i/sites/maya/devices/4' } };
export const OfflineSite: Story = { args: { path: '/i/sites/okafor?tab=technical' } };
export const AddSiteCustomer: Story = { args: { path: '/i/add' } };
export const AddSiteLayout: Story = { args: { path: '/i/add/layout' } };
export const AddSiteDone: Story = { args: { path: '/i/add/done' } };
export const Profile: Story = { args: { path: '/i/profile' } };
