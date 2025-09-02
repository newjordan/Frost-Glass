import { describe, it, expect, beforeEach } from 'vitest';
import axeCore from 'axe-core';

describe('Accessibility Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>';
    document.body.className = 'frost_dark';
  });

  it('should pass basic accessibility tests for button components', async () => {
    const container = document.getElementById('test-container')!;
    
    container.innerHTML = `
      <button class="frostdark-button-action">Primary Action</button>
      <button class="frostdark-button-raised">Raised Button</button>
      <button class="frostdark-button-action-danger">Danger Button</button>
    `;

    const results = await axeCore.run(container);
    
    expect(results.violations).toHaveLength(0);
    expect(results.passes).toBeDefined();
  });

  it('should pass accessibility tests for form components', async () => {
    const container = document.getElementById('test-container')!;
    
    container.innerHTML = `
      <form>
        <div class="frostdark-input-container">
          <label for="test-input">Test Input</label>
          <input id="test-input" type="text" class="frostdark-input-field" placeholder="Enter text">
        </div>
        
        <div class="frostdark-input-container">
          <label for="test-checkbox">
            <input id="test-checkbox" type="checkbox" class="frostdark-checkbox">
            Checkbox Label
          </label>
        </div>
      </form>
    `;

    const results = await axeCore.run(container);
    
    expect(results.violations).toHaveLength(0);
  });

  it('should validate color contrast ratios', async () => {
    const container = document.getElementById('test-container')!;
    
    container.innerHTML = `
      <div class="frostdark-app-content-card">
        <h3>Card Title</h3>
        <p>This is card content that should meet contrast requirements.</p>
      </div>
    `;

    const results = await axeCore.run(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    
    const contrastViolations = results.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});