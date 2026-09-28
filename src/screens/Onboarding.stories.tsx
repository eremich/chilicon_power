import type { Meta, StoryObj } from '@storybook/react-vite';
import { SCENARIOS } from '../data/types';
import { ScreenPreview, seedScreen, type ScreenArgs } from './ScreenPreview';

const meta = {
  title: 'Screens/Onboarding',
  component: ScreenPreview,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  beforeEach: ({ args }) => seedScreen(args as ScreenArgs),
  argTypes: { scenario: { control: 'select', options: SCENARIOS }, path: { control: 'text' } },
  args: { scenario: 'default', path: '/start' },
} satisfies Meta<typeof ScreenPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {};
export const LogIn: Story = { args: { path: '/start/login' } };
export const ResetPassword: Story = { args: { path: '/start/reset' } };
export const SignUp: Story = { args: { path: '/start/signup' } };
export const WhoAreYou: Story = { args: { path: '/start/role' } };
export const VerifyEmail: Story = { args: { path: '/start/verify' } };
export const AddSystem: Story = { args: { path: '/setup' } };
export const AcceptInvite: Story = { args: { path: '/setup/invite' } };
export const ScanGateway: Story = { args: { path: '/setup/scan' } };
export const CameraDenied: Story = { args: { path: '/setup/scan?camera=denied' } };
export const ManualCode: Story = { args: { path: '/setup/manual' } };
export const Address: Story = { args: { path: '/setup/address' } };
export const Details: Story = { args: { path: '/setup/details' } };
export const ConnectingOffline: Story = { args: { path: '/setup/connecting?result=offline' } };
export const WaitingForData: Story = { args: { path: '/setup/waiting' } };
