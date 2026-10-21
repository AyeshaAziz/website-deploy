import type { Meta, StoryObj } from '@storybook/react-vite';
import { AboutSections } from '.';

const meta = {
  title: 'Sections/About',
  component: AboutSections,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutSections>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
