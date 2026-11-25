/**
 * Concatenate the library in source order and minify it with Lightning CSS.
 * No glob, no cat, no live-server.
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "lightningcss";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const sources = [
  "src/core/variables.css",
  "src/core/base.css",
  "src/core/utilities.css",
  "src/components/typography.css",
  "src/components/cards.css",
  "src/components/navigation.css",
  "src/components/buttons.css",
  "src/components/code-blocks.css",
  "src/components/glass-button.css",
  "src/effects/animations.css",
  "src/themes/frost-light.css",
  "src/themes/frost-dark.css",
  "src/core/a11y.css",
];

const banner = `/*! Frost Glass CSS v1.1.0 | MIT | https://github.com/newjordan/Frost-Glass */\n`;

const css =
  banner +
  sources
    .map((file) => `/* ${file} */\n` + readFileSync(resolve(root, file), "utf8"))
    .join("\n");

const required = [
  ".frost_dark .frost-btn-action",
  ".frost_light .frost-btn-action",
  ".frostdark-button-action",
  ".frostlight-button-action",
  ".frost-btn-glass",
  ".button--glass",
  "prefers-reduced-transparency",
  "prefers-color-scheme",
  "forced-colors",
  "color-scheme:",
];

for (const needle of required) {
  if (!css.includes(needle)) {
    console.error(`Build is missing ${needle}`);
    process.exit(1);
  }
}

mkdirSync(resolve(root, "dist"), { recursive: true });
mkdirSync(resolve(root, "docs"), { recursive: true });

const prettyPath = resolve(root, "dist/frost-glass.css");
writeFileSync(prettyPath, css);

const minified = transform({
  filename: "frost-glass.css",
  code: Buffer.from(css),
  minify: true,
  sourceMap: false,
});

// Lightning CSS keeps -webkit-backdrop-filter and drops the standard property
// when both declare the same value. Chrome reads the standard property.
function restoreBackdropFilter(input) {
  return input.replace(/-webkit-backdrop-filter:([^;}{]+)/g, (match, value, offset, source) => {
    const after = source.slice(offset + match.length, offset + match.length + 24);
    if (after.startsWith(";backdrop-filter:")) return match;
    return `${match};backdrop-filter:${value}`;
  });
}

const minCss = banner + restoreBackdropFilter(minified.code.toString());
const minPath = resolve(root, "dist/frost-glass.min.css");
writeFileSync(minPath, minCss);
copyFileSync(minPath, resolve(root, "docs/frost-glass.min.css"));

if (!minCss.includes(".frost_dark .frost-btn-action{") && !minCss.includes(".frost-btn-action{")) {
  console.error("Minified CSS is missing the canonical action button");
  process.exit(1);
}
if (!/-webkit-backdrop-filter:[^;]+;backdrop-filter:/.test(minCss)) {
  console.error("Minified CSS dropped the standard backdrop-filter property");
  process.exit(1);
}

const before = Buffer.byteLength(css);
const after = Buffer.byteLength(minCss);
const saved = Math.round((1 - after / before) * 100);
console.log(
  `frost-glass.css ${before} bytes → frost-glass.min.css ${after} bytes (${saved}% smaller)`,
);
