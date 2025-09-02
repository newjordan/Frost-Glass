import { beforeEach, afterEach } from 'vitest';
import axeCore from 'axe-core';
import { getByRole, getByText } from '@testing-library/dom';

// Global DOM cleanup
beforeEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

// Add axe-core configuration
axeCore.configure({
  rules: [
    {
      id: 'color-contrast',
      enabled: true
    },
    {
      id: 'keyboard-navigation',
      enabled: true
    },
    {
      id: 'focus-management',
      enabled: true
    }
  ]
});

// Global test utilities
declare global {
  function addFrostCSS(): void;
  function removeFrostCSS(): void;
  function runAxeTests(element: Element): Promise<axeCore.AxeResults>;
}

global.addFrostCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../dist/frost-glass.css';
  link.id = 'frost-css';
  document.head.appendChild(link);
};

global.removeFrostCSS = () => {
  const link = document.getElementById('frost-css');
  if (link) {
    link.remove();
  }
};

global.runAxeTests = async (element: Element): Promise<axeCore.AxeResults> => {
  return axeCore.run(element, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21aa']
    }
  });
};