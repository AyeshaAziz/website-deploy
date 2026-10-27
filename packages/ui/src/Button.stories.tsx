import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ButtonSize, ButtonVariant } from './Button';
import { Button, ButtonLink } from './Button';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'brand'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Button', variant: 'primary', size: 'md' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const VariantsAndSizes: Story = {
  args: {
    size: 'lg',
  },

  render: () => (
    <div className="grid grid-cols-[auto_repeat(3,minmax(0,max-content))] items-center gap-x-6 gap-y-3">
      <div />
      {VARIANTS.map((variant) => (
        <div key={variant} className="text-small font-semibold capitalize text-primary-neg2">
          {variant}
        </div>
      ))}
      {SIZES.map((size) => (
        <Fragment key={size}>
          <div className="text-small font-semibold capitalize text-primary-neg2">{size}</div>
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              Button
            </Button>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <ButtonLink href="#" variant="primary" size="md">
      ButtonLink
    </ButtonLink>
  ),
};
