import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorsPage, MotionPage, ShapePage, TypePage, UnitsPage } from './Foundations';

const meta = { title: 'Foundations/Tokens', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = { render: () => <ColorsPage /> };
export const Typography: Story = { render: () => <TypePage /> };
export const Units: Story = { render: () => <UnitsPage /> };
export const ShapeSpaceElevation: Story = { name: 'Shape, space, elevation', render: () => <ShapePage /> };
export const Motion: Story = { render: () => <MotionPage /> };
