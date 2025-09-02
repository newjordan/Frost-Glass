// Core component types
export type Theme = 'frost_dark' | 'frost_light' | 'auto';

export type ComponentState = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'error' | 'loading';

export interface ComponentConfig {
  theme?: Theme;
  autoInit?: boolean;
  accessibility?: AccessibilityConfig;
}

export interface AccessibilityConfig {
  announceChanges?: boolean;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
  focusManagement?: boolean;
}

// Form component types
export interface FormFieldConfig extends ComponentConfig {
  validation?: ValidationConfig;
  errorDisplay?: 'inline' | 'tooltip' | 'none';
}

export interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customRules?: ValidationRule[];
}

export interface ValidationRule {
  name: string;
  validator: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// Modal component types
export interface ModalConfig extends ComponentConfig {
  closable?: boolean;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

// Notification types
export interface NotificationConfig extends ComponentConfig {
  type?: 'info' | 'success' | 'warning' | 'error';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration?: number;
  closable?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

// Event types
export interface ComponentEvent<T = any> extends CustomEvent<T> {
  component: BaseComponent;
}

export type EventCallback<T = any> = (event: ComponentEvent<T>) => void;

// Base component interface
export interface BaseComponent {
  readonly id: string;
  readonly element: HTMLElement;
  readonly config: ComponentConfig;
  readonly state: ComponentState;
  
  initialize(): void;
  destroy(): void;
  setState(state: ComponentState): void;
  getState(): ComponentState;
  on(event: string, callback: EventCallback): void;
  off(event: string, callback: EventCallback): void;
  emit(event: string, data?: any): void;
}

// Library initialization
export interface FrostGlassConfig {
  theme?: Theme;
  components?: {
    forms?: boolean;
    modals?: boolean;
    notifications?: boolean;
    navigation?: boolean;
  };
  accessibility?: AccessibilityConfig;
  debug?: boolean;
}