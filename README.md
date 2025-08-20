# Frost Glass CSS

A modern glassmorphism CSS library with dual theme support (Dark & Light) featuring comprehensive component examples and copy-ready code snippets.

## ✨ Features

- **Dual Theme Support**: Complete dark and light theme implementations
- **Glassmorphism Design**: Modern backdrop-filter effects with blur and transparency
- **Component Library**: Comprehensive set of UI components
- **Code Examples**: Live previews with copy-to-clipboard functionality
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: High contrast support and reduced motion preferences
- **Modern CSS**: Uses latest CSS features with fallbacks

## 🚀 Quick Start

### CDN Usage

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/frost-glass-css@1.0.0/dist/frost-glass.min.css">

<!-- Your HTML content -->
<div class="frost_dark">
    <button class="frostdark-button-action">Click me</button>
</div>
```

### NPM Installation

```bash
npm install frost-glass-css
```

```javascript
import 'frost-glass-css/dist/frost-glass.css';
```

### Local Development

```bash
git clone https://github.com/frost-glass-css/frost-glass-css.git
cd frost-glass-css
npm install
npm run dev
```

## 🎨 Theme System

### Dark Theme (Default)
Use `frost_dark` class on the body or container:

```html
<body class="frost_dark">
    <div class="frostdark-app-content-card">
        <h3>Dark Theme Card</h3>
        <p>Content with glassmorphism effects</p>
    </div>
</body>
```

### Light Theme
Use `frost_light` class on the body or container:

```html
<body class="frost_light">
    <div class="frostlight-app-content-card">
        <h3>Light Theme Card</h3>
        <p>Content with light glassmorphism effects</p>
    </div>
</body>
```

## 🧩 Components

### Buttons

```html
<!-- Primary Action Button -->
<button class="frostdark-button-action">Primary Action</button>

<!-- Success Button -->
<button class="frostdark-button-raised">Success Button</button>

<!-- Danger Button -->
<button class="frostdark-button-action-danger">Delete Item</button>

<!-- Small Button -->
<button class="frostdark-button-action frostdark-button-action-sm">Small</button>

<!-- Icon Button -->
<button class="frostdark-button-action frostdark-button-action-icon">🔍</button>
```

### Content Cards

```html
<!-- Main Content Card -->
<div class="frostdark-app-content-card">
    <h3>Card Title</h3>
    <p class="text-content">Card content with proper typography and spacing.</p>
    <div class="demo-button-group">
        <button class="frostdark-button-action">Action</button>
    </div>
</div>

<!-- Standard Glass Card -->
<div class="standard-glass-card">
    <h3>Standard Card</h3>
    <p>Classic glassmorphism styling</p>
</div>
```

### Form Controls

```html
<!-- Input Container -->
<div class="input-container">
    <input type="text" class="input-field" placeholder="Enter text...">
</div>

<!-- Textarea with Send Button -->
<div class="conv-input-container">
    <textarea class="conv-input" placeholder="Type your message..."></textarea>
    <button class="conv-send-btn">→</button>
</div>
```

### Toggle Switches

```html
<!-- Settings Toggle -->
<div class="frostdark-settings-toggle" onclick="toggleSwitch(this)">
    <div class="frostdark-settings-toggle-thumb"></div>
</div>

<script>
function toggleSwitch(element) {
    const isChecked = element.dataset.state === 'checked';
    element.dataset.state = isChecked ? '' : 'checked';
    element.classList.toggle('active', !isChecked);
}
</script>
```

### Navigation Items

```html
<!-- Navigation Item -->
<div class="frostdark-app-nav-item active">
    <span>🏠</span>
    <span>Dashboard</span>
</div>

<!-- Logo Component -->
<div class="frostdark-app-logo">
    <div class="frostdark-app-logo-icon">
        <img src="logo.png" alt="Logo">
    </div>
    <div>
        <div class="frostdark-app-title">App Name</div>
        <div class="frostdark-app-subtitle">Subtitle</div>
    </div>
</div>
```

## 📝 Code Examples System

The library includes a comprehensive code example system that provides:

- **Live Previews**: See components in action
- **Copy-to-Clipboard**: One-click code copying
- **Syntax Highlighting**: Colored HTML/CSS for better readability
- **Theme Switching**: Examples work with both dark and light themes

### Using Code Examples

```html
<div class="frostdark-code-example">
    <div class="frostdark-code-preview">
        <!-- Live component preview goes here -->
        <button class="frostdark-button-action">Sample Button</button>
    </div>
    <div class="frostdark-code-block">
        <div class="frostdark-code-header">
            <span class="frostdark-code-title">Button Component</span>
            <button class="frostdark-copy-button" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <div class="frostdark-code-content">
            <pre><code>&lt;button class="frostdark-button-action"&gt;Sample Button&lt;/button&gt;</code></pre>
        </div>
    </div>
</div>
```

### JavaScript Utilities

Include the code utilities for enhanced functionality:

```html
<script src="code-utils.js"></script>
<script>
    // Copy code function
    function copyCode(button) {
        const codeBlock = button.closest('.frostdark-code-example');
        const codeContent = codeBlock.querySelector('code');
        // ... copy logic
    }
</script>
```

## 🎯 Typography System

### Headings

```html
<h1>Main Title with Gradient</h1>
<h2>Section Title</h2>
<h3>Card Title</h3>
<h4>Subsection Title</h4>
<h5>Component Title</h5>
<h6>Minor Heading</h6>
```

### Text Utilities

```html
<p class="text-primary">Primary text - High contrast</p>
<p class="text-secondary">Secondary text - Medium contrast</p>
<p class="text-muted">Muted text - Lower contrast</p>
<p class="text-content">Content text - Optimized for reading</p>
<p class="text-nav">Navigation text</p>
<p class="text-accent">Accent text</p>
<p class="text-danger">Danger text</p>
```

## 🌈 Color System

### Dark Theme Colors
- **Primary**: `rgba(255, 255, 255, 1)` - White text
- **Secondary**: `rgba(194, 245, 245, 0.9)` - Cyan text
- **Accent**: `rgba(6, 182, 212, 0.8)` - Blue accent
- **Background**: `rgba(15, 23, 42, 0.95)` - Dark blue

### Light Theme Colors
- **Primary**: `rgba(71, 85, 105, 1)` - Dark gray text
- **Secondary**: `rgba(20, 184, 166, 0.8)` - Teal text
- **Accent**: `rgba(6, 182, 212, 0.8)` - Cyan accent
- **Background**: `rgba(255, 255, 255, 0.8)` - White with transparency

## 📱 Responsive Design

The library is built with mobile-first responsive design:

```css
/* Mobile (default) */
.demo-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
    .demo-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
    }
}
```

## ♿ Accessibility Features

- **High Contrast Mode**: Enhanced borders and contrast
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML structure
- **Focus Indicators**: Clear focus states

## 🛠️ Development

### Project Structure

```
frost-glass-css/
├── src/
│   ├── core/           # Base styles and utilities
│   ├── components/     # Component-specific styles
│   ├── effects/        # Animations and effects
│   └── themes/         # Dark and light themes
├── examples/           # Demo and documentation
├── dist/              # Built CSS files
└── package.json
```

### Build Commands

```bash
# Development server
npm run dev

# Build CSS
npm run build

# Minify CSS
npm run minify

# Lint CSS
npm run lint

# Format CSS
npm run format
```

### Adding New Components

1. Create component CSS in `src/components/`
2. Add theme-specific styles in `src/themes/`
3. Create demo examples in `examples/index.html`
4. Add code examples with the code block system

## 📚 Browser Support

- **Chrome**: 76+
- **Firefox**: 72+
- **Safari**: 13+
- **Edge**: 79+
- **iOS**: 13+
- **Android**: 76+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern glassmorphism design trends
- Built with accessibility and performance in mind
- Community-driven development and feedback

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/frost-glass-css/frost-glass-css/issues)
- **Discussions**: [GitHub Discussions](https://github.com/frost-glass-css/frost-glass-css/discussions)
- **Documentation**: [GitHub Wiki](https://github.com/frost-glass-css/frost-glass-css/wiki)

---

**Frost Glass CSS** - Modern glassmorphism components for the web 🌟