import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Components/Buttons',
  parameters: {
    docs: {
      description: {
        component: 'Frost Glass CSS button components with glassmorphism effects.'
      }
    }
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['frostdark', 'frostlight'],
      description: 'Button theme variant'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state'
    }
  }
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    theme: 'frostdark',
    disabled: false
  },
  render: (args) => {
    const prefix = args.theme === 'frostdark' ? 'frostdark' : 'frostlight';
    return `
      <button class="${prefix}-button-action" ${args.disabled ? 'disabled' : ''}>
        Primary Action
      </button>
    `;
  }
};

export const Raised: Story = {
  args: {
    theme: 'frostdark',
    disabled: false
  },
  render: (args) => {
    const prefix = args.theme === 'frostdark' ? 'frostdark' : 'frostlight';
    return `
      <button class="${prefix}-button-raised" ${args.disabled ? 'disabled' : ''}>
        Raised Button
      </button>
    `;
  }
};

export const Danger: Story = {
  args: {
    theme: 'frostdark',
    disabled: false
  },
  render: (args) => {
    const prefix = args.theme === 'frostdark' ? 'frostdark' : 'frostlight';
    return `
      <button class="${prefix}-button-action-danger" ${args.disabled ? 'disabled' : ''}>
        Danger Action
      </button>
    `;
  }
};

export const AllVariants: Story = {
  args: {
    theme: 'frostdark'
  },
  render: (args) => {
    const prefix = args.theme === 'frostdark' ? 'frostdark' : 'frostlight';
    return `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button class="${prefix}-button-action">Primary</button>
        <button class="${prefix}-button-raised">Raised</button>
        <button class="${prefix}-button-action-danger">Danger</button>
        <button class="${prefix}-button-action" disabled>Disabled</button>
      </div>
    `;
  }
};