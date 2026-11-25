# Frost Glass

Pure-CSS glassmorphism library by Frosty40. Light and dark themes, no JavaScript.

## Install

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/newjordan/Frost-Glass@master/dist/frost-glass.min.css">
```

After the package is published:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/frost-glass-css@1.1.0/dist/frost-glass.min.css">
```

```css
@import "frost-glass-css";
```

Or build it yourself (Node 18+):

```bash
npm install
npm run build
```

`npm run build` concatenates `src/` in a fixed order and minifies with [Lightning CSS](https://lightningcss.dev/). It writes:

- `dist/frost-glass.css`
- `dist/frost-glass.min.css`
- `docs/frost-glass.min.css` (the static docs page)

`npm run dev` builds, then serves the repo at `http://localhost:4173/docs/`.

The docs page is static. GitHub Pages can publish the `docs/` folder as-is.

## Quick start

```html
<div class="frost_dark">
  <button class="frost-btn frost-btn-action">Click me</button>
</div>
```

`frost_dark` and `frost_light` set the theme on an ancestor. Components read that theme. They do not each carry a dark or light prefix anymore, though the old prefixes still work.

## Class names

Two names grew apart.

- This library’s theme files shipped `frostdark-button-*` and `frostlight-button-*`.
- The shared component file, and the private [bbuilder](https://github.com/newjordan/bbuilder) repo, use `frost-btn-*`.
- bbuilder’s button studies also use `button--glass` for a parametric glass button.

Those selectors now share rules. New markup should use the canonical name, inside `frost_dark` or `frost_light`. Existing markup can stay.

| Role | Canonical | Legacy dark | Legacy light |
| --- | --- | --- | --- |
| Base layout | `frost-btn` | included on the legacy buttons | included on the legacy buttons |
| Glass action | `frost-btn-action` | `frostdark-button-action` | `frostlight-button-action` |
| Raised glass | `frost-btn-raised` | `frostdark-button-raised` | `frostlight-button-raised` |
| Glass danger | `frost-btn-action-danger` | `frostdark-button-action-danger` | `frostlight-button-action-danger` |
| Small modifier | `frost-btn-action-sm` | `frostdark-button-action-sm` | `frostlight-button-action-sm` |
| Icon modifier | `frost-btn-action-icon` | `frostdark-button-action-icon` | `frostlight-button-action-icon` |
| Action row | `frost-btn-action-group` | `frostdark-button-group` | `frostlight-button-group` |
| Quiet primary, secondary, outline, ghost | `frost-btn-primary` `frost-btn-secondary` `frost-btn-outline` `frost-btn-ghost` | same classes | same classes |
| Tinted danger and success | `frost-btn-danger` `frost-btn-success` | not the glass action | not the glass action |
| Parametric glass | `frost-btn-glass` | alias `button--glass` | alias `button--glass` |

`frost-btn-danger` is the tinted danger button from the component set. `frost-btn-action-danger` is the translucent glass danger button. They are different on purpose.

`frost-btn-group` is the joined component group. `frost-btn-action-group` is the spaced row that used to be `frostdark-button-group`.

Cards, fields, and navigation keep their existing names (`frost-card`, `frost-nav-item`, `frostdark-input-container`, `frostlight-app-content-card`, and the rest).

### Quiet buttons

```html
<button class="frost-btn frost-btn-primary">Primary</button>
<button class="frost-btn frost-btn-secondary">Secondary</button>
<button class="frost-btn frost-btn-outline">Outline</button>
<button class="frost-btn frost-btn-ghost">Ghost</button>
```

### Cards, fields, navigation

```html
<div class="frost-card">
  <h3>Card title</h3>
  <p>Content here</p>
</div>

<div class="frostdark-input-container">
  <input class="frostdark-input-field" type="text" placeholder="Enter text">
</div>

<nav class="frost-nav">
  <a class="frost-nav-item active" href="#dashboard">Dashboard</a>
</nav>
```

Swap `frostdark-` for `frostlight-` on the prefixed field classes when the ancestor is `frost_light`.

## Themes

Custom properties live on `:root` and are reassigned by `.frost_light` and `.frost_dark`. Override the tokens you need:

```css
.frost_dark {
  --frost-dark-text-primary: #f8fafc;
  --frost-blur-light: blur(8px) saturate(140%);
  --frost-focus: #a5f3fc;
}
```

`frost-btn-glass` is the parametric button. The docs builder edits its variables (radius, blur, tint, gloss, reflection stripe, rim, elevation) and can copy them out. `button--glass` points at the same rule.

## Accessibility

- `color-scheme` is set to `light` or `dark` with the theme class. With no theme class, it follows `prefers-color-scheme`.
- `backdrop-filter` is paired with `-webkit-backdrop-filter`. When neither is supported, surfaces fall back to an opaque color (`--frost-solid-light`, `--frost-solid-dark`, or `--fg-solid` on the glass button).
- `prefers-reduced-transparency: reduce` removes the blur and paints those same solid fills.
- `prefers-reduced-motion: reduce` drops hover lifts and animations.
- `prefers-contrast` and `forced-colors` replace glass with solid, high-contrast controls.
- Text tokens that were too faint (light titles around 42% opacity, dark secondary text around 60% opacity) are darkened in `src/core/a11y.css`. The original theme rules are still in the theme files.
- Light-theme glass actions use an opaque fill so a white label clears 4.5:1 on the mint page. Dark-theme actions stay translucent, because they sit on a near-black background.
- Buttons and nav items show a `:focus-visible` outline.

## Project layout

```
src/core/         variables, base glass, utilities, a11y
src/components/   buttons, cards, navigation, typography, glass button
src/themes/       frost-light.css, frost-dark.css
src/effects/      animations
dist/             built CSS
docs/             static demo, including the button builder
```

Unbundled entry: `src/themes/frost-glass.css` (`@import`s the same sources). Published entry: `dist/frost-glass.css`.

## Browser support

Chrome 111+, Edge 111+, Firefox 103+, Safari 16.4+. Older browsers still get the opaque fallbacks.

## Attribution

- Frost Glass by Frosty40, MIT. The theme scenes were extracted from [SpeakMCP](https://github.com/SpeakMCP/SpeakMCP).
- The parametric button (gloss, angled reflection stripe, inset rim, elevation, and the Frosted, Crystal, Jelly, Chrome, and Dark Glass presets) is adapted from the button studies in the private bbuilder repo. Those notes map the stripe to a reflection normal, `n = (-sin a, cos a)`, and cite the reflection, anti-aliasing, and SDF-normal chapters of *Visualizing Equations, Shaders, and Procedural Shapes*.

## License

MIT. See [LICENSE](LICENSE).
