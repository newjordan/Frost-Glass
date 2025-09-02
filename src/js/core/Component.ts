import type { 
  BaseComponent, 
  ComponentConfig, 
  ComponentState, 
  EventCallback,
  Theme
} from '../../types/index';

/**
 * Base component class that provides common functionality for all interactive components
 */
export abstract class Component implements BaseComponent {
  public readonly id: string;
  public readonly element: HTMLElement;
  public readonly config: ComponentConfig;
  
  private _state: ComponentState = 'default';
  
  public get state(): ComponentState {
    return this._state;
  }
  private _eventListeners: Map<string, Set<EventCallback>> = new Map();
  private _isDestroyed: boolean = false;

  constructor(element: HTMLElement, config: ComponentConfig = {}) {
    this.element = element;
    this.config = {
      theme: 'auto',
      autoInit: true,
      accessibility: {
        announceChanges: true,
        keyboardNavigation: true,
        screenReaderSupport: true,
        focusManagement: true
      },
      ...config
    };

    // Generate unique ID
    this.id = this.generateId();
    
    // Set component ID on element
    if (!this.element.id) {
      this.element.id = this.id;
    }

    // Apply theme classes
    this.applyTheme();

    // Initialize component if autoInit is enabled
    if (this.config.autoInit) {
      this.initialize();
    }
  }

  /**
   * Initialize the component
   */
  public initialize(): void {
    if (this._isDestroyed) {
      throw new Error('Cannot initialize destroyed component');
    }

    this.setupEventListeners();
    this.setupAccessibility();
    this.emit('initialized');
  }

  /**
   * Destroy the component and clean up resources
   */
  public destroy(): void {
    if (this._isDestroyed) return;

    this.emit('beforeDestroy');
    this.removeEventListeners();
    this._eventListeners.clear();
    this._isDestroyed = true;
    this.emit('destroyed');
  }

  /**
   * Set component state
   */
  public setState(state: ComponentState): void {
    if (this._isDestroyed) return;

    const previousState = this._state;
    this._state = state;

    // Apply state classes
    this.applyStateClasses(previousState, state);

    // Announce state changes for accessibility
    if (this.config.accessibility?.announceChanges) {
      this.announceStateChange(previousState, state);
    }

    this.emit('stateChange', { previousState, currentState: state });
  }

  /**
   * Get current component state
   */
  public getState(): ComponentState {
    return this._state;
  }

  /**
   * Add event listener
   */
  public on(event: string, callback: EventCallback): void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, new Set());
    }
    this._eventListeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  public off(event: string, callback: EventCallback): void {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this._eventListeners.delete(event);
      }
    }
  }

  /**
   * Emit event
   */
  public emit(event: string, data?: any): void {
    if (this._isDestroyed && event !== 'destroyed') return;

    const listeners = this._eventListeners.get(event);
    if (listeners) {
      const customEvent = new CustomEvent(event, {
        detail: { ...data, component: this },
        bubbles: true,
        cancelable: true
      });

      listeners.forEach(callback => {
        try {
          callback(customEvent as any);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }

    // Also dispatch on the element
    this.element.dispatchEvent(new CustomEvent(`frost:${event}`, {
      detail: { ...data, component: this },
      bubbles: true,
      cancelable: true
    }));
  }

  /**
   * Generate unique component ID
   */
  private generateId(): string {
    return `frost-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Apply theme classes to element
   */
  private applyTheme(): void {
    const theme = this.resolveTheme();
    this.element.classList.add(theme);
    
    // Store theme for child components
    this.element.dataset.frostTheme = theme;
  }

  /**
   * Resolve theme based on config and system preferences
   */
  private resolveTheme(): Theme {
    if (this.config.theme === 'auto') {
      // Detect system theme preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'frost_dark';
      }
      return 'frost_light';
    }
    return this.config.theme || 'frost_dark';
  }

  /**
   * Apply state-specific CSS classes
   */
  private applyStateClasses(previousState: ComponentState, currentState: ComponentState): void {
    // Remove previous state class
    this.element.classList.remove(`frost-state-${previousState}`);
    
    // Add current state class
    this.element.classList.add(`frost-state-${currentState}`);

    // Handle special states
    if (currentState === 'disabled') {
      this.element.setAttribute('aria-disabled', 'true');
      if (this.element instanceof HTMLButtonElement || this.element instanceof HTMLInputElement) {
        (this.element as HTMLButtonElement | HTMLInputElement).disabled = true;
      }
    } else {
      this.element.removeAttribute('aria-disabled');
      if (this.element instanceof HTMLButtonElement || this.element instanceof HTMLInputElement) {
        (this.element as HTMLButtonElement | HTMLInputElement).disabled = false;
      }
    }
  }

  /**
   * Announce state changes for screen readers
   */
  private announceStateChange(_previousState: ComponentState, currentState: ComponentState): void {
    const announcements: Record<ComponentState, string> = {
      default: 'Ready',
      hover: 'Highlighted',
      focus: 'Focused',
      active: 'Activated',
      disabled: 'Disabled',
      error: 'Error state',
      loading: 'Loading'
    };

    const message = announcements[currentState];
    if (message) {
      this.announceToScreenReader(message);
    }
  }

  /**
   * Announce message to screen readers
   */
  private announceToScreenReader(message: string): void {
    // Create temporary live region for announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'frost-sr-only';
    announcement.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Setup component-specific event listeners
   * To be implemented by child classes
   */
  protected abstract setupEventListeners(): void;

  /**
   * Remove component-specific event listeners
   * To be implemented by child classes
   */
  protected abstract removeEventListeners(): void;

  /**
   * Setup accessibility features
   */
  private setupAccessibility(): void {
    if (!this.config.accessibility) return;

    // Setup keyboard navigation
    if (this.config.accessibility.keyboardNavigation) {
      this.setupKeyboardNavigation();
    }

    // Setup screen reader support
    if (this.config.accessibility.screenReaderSupport) {
      this.setupScreenReaderSupport();
    }
  }

  /**
   * Setup keyboard navigation
   * To be overridden by child classes for specific behavior
   */
  protected setupKeyboardNavigation(): void {
    // Default keyboard navigation - can be overridden
    this.element.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          if (this.element.tagName === 'BUTTON' || this.element.getAttribute('role') === 'button') {
            event.preventDefault();
            this.element.click();
          }
          break;
        case 'Escape':
          this.emit('escape', { event });
          break;
      }
    });
  }

  /**
   * Setup screen reader support
   * To be overridden by child classes for specific behavior
   */
  protected setupScreenReaderSupport(): void {
    // Ensure element is focusable if it needs to be
    if (!this.element.hasAttribute('tabindex') && this.element.tagName !== 'BUTTON' && this.element.tagName !== 'INPUT') {
      const isInteractive = this.element.hasAttribute('role') && 
        ['button', 'textbox', 'checkbox', 'radio'].includes(this.element.getAttribute('role')!);
      
      if (isInteractive) {
        this.element.setAttribute('tabindex', '0');
      }
    }
  }
}