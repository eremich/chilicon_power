import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, CircleDollarSign, House, LogOut, Moon, Wrench } from 'lucide-react';
import { ListGroup, ListRow } from './ListRow';

const icon = (I: typeof Bell) => <I aria-hidden className="size-[22px]" strokeWidth={1.75} />;

const meta = {
  title: 'Components/ListRow',
  component: ListRow,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { title: 'Electricity rate', trailing: '$0.32/kWh', leading: icon(CircleDollarSign), onClick: () => {} },
  parameters: { docs: { description: { component: 'Inset grouped list rows for Profile and settings. Title, optional subtitle, a value on the right, chevron when it opens something.' } } },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (a) => <ListGroup><ListRow {...a} /></ListGroup> };
export const WithSubtitle: Story = {
  render: () => (
    <ListGroup>
      <ListRow leading={icon(Wrench)} title="Sunline Solar" subtitle="Marco Ruiz · Full technical view" onClick={() => {}} />
    </ListGroup>
  ),
};
export const ProfileGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-6 bg-canvas py-4">
      <ListGroup header="Systems">
        <ListRow leading={icon(House)} title="Home, Sacramento CA" subtitle="8.8 kW · 24 panels" onClick={() => {}} />
        <ListRow leading={icon(House)} title="Cabin, Lake Tahoe" subtitle="4.4 kW · 12 panels" onClick={() => {}} />
      </ListGroup>
      <ListGroup header="Preferences" footer="We only notify you when there is something to do.">
        <ListRow leading={icon(CircleDollarSign)} title="Electricity rate" trailing="$0.32/kWh" onClick={() => {}} />
        <ListRow leading={icon(Bell)} title="Notifications" trailing="Issues, monthly" onClick={() => {}} />
        <ListRow leading={icon(Moon)} title="Appearance" trailing="System" onClick={() => {}} />
      </ListGroup>
      <ListGroup>
        <ListRow leading={<LogOut aria-hidden className="size-[22px] text-fault" strokeWidth={1.75} />} title="Log out" destructive onClick={() => {}} />
      </ListGroup>
    </div>
  ),
};
