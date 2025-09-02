// Core exports
export { Component } from './core/Component';

// Type exports
export type {
  Theme,
  ComponentState,
  ComponentConfig,
  BaseComponent,
  FrostGlassConfig
} from '../types/index';

// Main library class
import type { FrostGlassConfig, Theme } from '../types/index';

/**
 * Main Frost Glass CSS JavaScript library
 * Provides progressive enhancement for CSS-only components
 */
export class FrostGlass {
  private static instance: FrostGlass;
  private config: FrostGlassConfig;
  private components: Map<string, any> = new Map();

  private constructor(config: FrostGlassConfig = {}) {
    this.config = {
      theme: 'auto',
      components: {
        forms: true,
        modals: true,
        notifications: true,
        navigation: true
      },
      accessibility: {
        announceChanges: true,
        keyboardNavigation: true,
        screenReaderSupport: true,
        focusManagement: true
      },
      debug: false,
      ...config
    };
  }

  /**
   * Initialize Frost Glass CSS library
   */
  public static init(config: FrostGlassConfig = {}): FrostGlass {
    if (!FrostGlass.instance) {
      FrostGlass.instance = new FrostGlass(config);
      FrostGlass.instance.initialize();
    }
    return FrostGlass.instance;
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): FrostGlass | null {
    return FrostGlass.instance || null;
  }

  /**
   * Initialize the library
   */
  private initialize(): void {
    this.applyGlobalTheme();
    this.setupThemeListener();
    this.autoDiscoverComponents();
    
    if (this.config.debug) {
      console.log('Frost Glass CSS initialized', this.config);
    }
  }

  /**
   * Apply global theme
   */
  private applyGlobalTheme(): void {
    const theme = this.resolveTheme();
    document.body.classList.remove('frost_dark', 'frost_light');
    document.body.classList.add(theme);
  }

  /**
   * Setup theme change listener
   */
  private setupThemeListener(): void {
    if (this.config.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        this.applyGlobalTheme();
        this.notifyComponentsOfThemeChange();
      });
    }
  }

  /**
   * Auto-discover and enhance components
   */
  private autoDiscoverComponents(): void {
    // This will be expanded as we add more components
    const componentSelectors = [
      '[class*="frost"]:not([data-frost-enhanced])'
    ];

    componentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.enhanceElement(element as HTMLElement);
      });
    });
  }

  /**
   * Enhance a single element with JavaScript behavior
   */
  private enhanceElement(element: HTMLElement): void {
    // Mark as enhanced to prevent duplicate initialization
    element.setAttribute('data-frost-enhanced', 'true');

    // Component enhancement will be added here as we build them
    if (this.config.debug) {
      console.log('Enhanced element:', element);
    }
  }

  /**
   * Notify all components of theme changes
   */
  private notifyComponentsOfThemeChange(): void {
    this.components.forEach(component => {
      if (typeof component.onThemeChange === 'function') {
        component.onThemeChange(this.resolveTheme());
      }
    });
  }

  /**
   * Resolve current theme
   */
  private resolveTheme(): Theme {
    if (this.config.theme === 'auto') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'frost_dark';
      }
      return 'frost_light';
    }
    return this.config.theme || 'frost_dark';
  }

  /**
   * Get current theme
   */
  public getTheme(): Theme {
    return this.resolveTheme();
  }

  /**
   * Set theme
   */
  public setTheme(theme: Theme): void {
    this.config.theme = theme;
    this.applyGlobalTheme();
    this.notifyComponentsOfThemeChange();
  }

  /**
   * Register a component instance
   */
  public registerComponent(id: string, component: any): void {
    this.components.set(id, component);
  }

  /**
   * Unregister a component instance
   */
  public unregisterComponent(id: string): void {
    this.components.delete(id);
  }

  /**
   * Get component by ID
   */
  public getComponent(id: string): any | null {
    return this.components.get(id) || null;
  }

  /**
   * Get all components
   */
  public getAllComponents(): Map<string, any> {
    return new Map(this.components);
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      FrostGlass.init();
    });
  } else {
    FrostGlass.init();
  }
}

// Global export for browser usage
if (typeof window !== 'undefined') {
  (window as any).FrostGlass = FrostGlass;
}