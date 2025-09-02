import type { Preview } from '@storybook/html';
import '../src/themes/frost-glass.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'frost-dark',
      values: [
        {
          name: 'frost-dark',
          value: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        },
        {
          name: 'frost-light',
          value: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        },
        {
          name: 'white',
          value: '#ffffff',
        },
        {
          name: 'black',
          value: '#000000',
        },
      ],
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Frost Glass Theme',
      defaultValue: 'frost_dark',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'frost_dark', title: 'Dark Theme' },
          { value: 'frost_light', title: 'Light Theme' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'frost_dark';
      return `
        <div class="${theme}" style="min-height: 100vh; padding: 2rem;">
          ${story()}
        </div>
      `;
    },
  ],
};

export default preview;