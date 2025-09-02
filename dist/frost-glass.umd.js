(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FrostGlass = {}));
})(this, (function (exports) { 'use strict';

    /**
     * Base component class that provides common functionality for all interactive components
     */
    class Component {
        get state() {
            return this._state;
        }
        constructor(element, config = {}) {
            this._state = 'default';
            this._eventListeners = new Map();
            this._isDestroyed = false;
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
        initialize() {
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
        destroy() {
            if (this._isDestroyed)
                return;
            this.emit('beforeDestroy');
            this.removeEventListeners();
            this._eventListeners.clear();
            this._isDestroyed = true;
            this.emit('destroyed');
        }
        /**
         * Set component state
         */
        setState(state) {
            if (this._isDestroyed)
                return;
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
        getState() {
            return this._state;
        }
        /**
         * Add event listener
         */
        on(event, callback) {
            if (!this._eventListeners.has(event)) {
                this._eventListeners.set(event, new Set());
            }
            this._eventListeners.get(event).add(callback);
        }
        /**
         * Remove event listener
         */
        off(event, callback) {
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
        emit(event, data) {
            if (this._isDestroyed && event !== 'destroyed')
                return;
            const listeners = this._eventListeners.get(event);
            if (listeners) {
                const customEvent = new CustomEvent(event, {
                    detail: { ...data, component: this },
                    bubbles: true,
                    cancelable: true
                });
                listeners.forEach(callback => {
                    try {
                        callback(customEvent);
                    }
                    catch (error) {
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
        generateId() {
            return `frost-${Math.random().toString(36).substr(2, 9)}`;
        }
        /**
         * Apply theme classes to element
         */
        applyTheme() {
            const theme = this.resolveTheme();
            this.element.classList.add(theme);
            // Store theme for child components
            this.element.dataset.frostTheme = theme;
        }
        /**
         * Resolve theme based on config and system preferences
         */
        resolveTheme() {
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
        applyStateClasses(previousState, currentState) {
            // Remove previous state class
            this.element.classList.remove(`frost-state-${previousState}`);
            // Add current state class
            this.element.classList.add(`frost-state-${currentState}`);
            // Handle special states
            if (currentState === 'disabled') {
                this.element.setAttribute('aria-disabled', 'true');
                if (this.element instanceof HTMLButtonElement || this.element instanceof HTMLInputElement) {
                    this.element.disabled = true;
                }
            }
            else {
                this.element.removeAttribute('aria-disabled');
                if (this.element instanceof HTMLButtonElement || this.element instanceof HTMLInputElement) {
                    this.element.disabled = false;
                }
            }
        }
        /**
         * Announce state changes for screen readers
         */
        announceStateChange(_previousState, currentState) {
            const announcements = {
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
        announceToScreenReader(message) {
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
         * Setup accessibility features
         */
        setupAccessibility() {
            if (!this.config.accessibility)
                return;
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
        setupKeyboardNavigation() {
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
        setupScreenReaderSupport() {
            // Ensure element is focusable if it needs to be
            if (!this.element.hasAttribute('tabindex') && this.element.tagName !== 'BUTTON' && this.element.tagName !== 'INPUT') {
                const isInteractive = this.element.hasAttribute('role') &&
                    ['button', 'textbox', 'checkbox', 'radio'].includes(this.element.getAttribute('role'));
                if (isInteractive) {
                    this.element.setAttribute('tabindex', '0');
                }
            }
        }
    }

    // Core exports
    /**
     * Main Frost Glass CSS JavaScript library
     * Provides progressive enhancement for CSS-only components
     */
    class FrostGlass {
        constructor(config = {}) {
            this.components = new Map();
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
        static init(config = {}) {
            if (!FrostGlass.instance) {
                FrostGlass.instance = new FrostGlass(config);
                FrostGlass.instance.initialize();
            }
            return FrostGlass.instance;
        }
        /**
         * Get the singleton instance
         */
        static getInstance() {
            return FrostGlass.instance || null;
        }
        /**
         * Initialize the library
         */
        initialize() {
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
        applyGlobalTheme() {
            const theme = this.resolveTheme();
            document.body.classList.remove('frost_dark', 'frost_light');
            document.body.classList.add(theme);
        }
        /**
         * Setup theme change listener
         */
        setupThemeListener() {
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
        autoDiscoverComponents() {
            // This will be expanded as we add more components
            const componentSelectors = [
                '[class*="frost"]:not([data-frost-enhanced])'
            ];
            componentSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    this.enhanceElement(element);
                });
            });
        }
        /**
         * Enhance a single element with JavaScript behavior
         */
        enhanceElement(element) {
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
        notifyComponentsOfThemeChange() {
            this.components.forEach(component => {
                if (typeof component.onThemeChange === 'function') {
                    component.onThemeChange(this.resolveTheme());
                }
            });
        }
        /**
         * Resolve current theme
         */
        resolveTheme() {
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
        getTheme() {
            return this.resolveTheme();
        }
        /**
         * Set theme
         */
        setTheme(theme) {
            this.config.theme = theme;
            this.applyGlobalTheme();
            this.notifyComponentsOfThemeChange();
        }
        /**
         * Register a component instance
         */
        registerComponent(id, component) {
            this.components.set(id, component);
        }
        /**
         * Unregister a component instance
         */
        unregisterComponent(id) {
            this.components.delete(id);
        }
        /**
         * Get component by ID
         */
        getComponent(id) {
            return this.components.get(id) || null;
        }
        /**
         * Get all components
         */
        getAllComponents() {
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
        }
        else {
            FrostGlass.init();
        }
    }
    // Global export for browser usage
    if (typeof window !== 'undefined') {
        window.FrostGlass = FrostGlass;
    }

    exports.Component = Component;
    exports.FrostGlass = FrostGlass;

}));
//# sourceMappingURL=frost-glass.umd.js.map
