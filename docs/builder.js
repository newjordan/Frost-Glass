/**
 * Interactive glass-button builder for the Frost Glass docs.
 *
 * Presets and the gloss / reflection-stripe / rim / elevation model are
 * adapted from Frosty40's bbuilder studies (glass-button-prep.md), which
 * credit reflection and edge ideas to "Visualizing Equations, Shaders,
 * and Procedural Shapes". Original library by Frosty40, MIT.
 */
(function () {
  var PRESETS = {
    frosted: {
      name: "Frosted",
      label: "Primary action",
      radius: 16,
      padX: 22,
      padY: 12,
      blur: 10,
      sat: 140,
      c1: "#06b6d4",
      a1: 46,
      c2: "#0c3052",
      a2: 40,
      bc: "#67e8f9",
      ba: 55,
      bw: 1,
      rim: 28,
      gloss: 26,
      reflectAngle: 32,
      reflectWidth: 10,
      reflectAlpha: 34,
      elevation: 28,
      text: "#f4feff",
      solid: "#0e4f63",
    },
    crystal: {
      name: "Crystal",
      label: "Crystal",
      radius: 16,
      padX: 22,
      padY: 12,
      blur: 12,
      sat: 150,
      c1: "#e0f2fe",
      a1: 42,
      c2: "#bae6fd",
      a2: 28,
      bc: "#e0f2fe",
      ba: 70,
      bw: 1,
      rim: 22,
      gloss: 36,
      reflectAngle: 20,
      reflectWidth: 7,
      reflectAlpha: 40,
      elevation: 18,
      text: "#0f172a",
      solid: "#e0f2fe",
    },
    jelly: {
      name: "Jelly",
      label: "Jelly",
      radius: 18,
      padX: 24,
      padY: 13,
      blur: 8,
      sat: 170,
      c1: "#ef2aa0",
      a1: 62,
      c2: "#7c3aed",
      a2: 55,
      bc: "#f9a8d4",
      ba: 50,
      bw: 1,
      rim: 30,
      gloss: 32,
      reflectAngle: 45,
      reflectWidth: 12,
      reflectAlpha: 40,
      elevation: 32,
      text: "#fff7fb",
      solid: "#9d174d",
    },
    chrome: {
      name: "Chrome",
      label: "Chrome",
      radius: 14,
      padX: 22,
      padY: 12,
      blur: 6,
      sat: 110,
      c1: "#e2e8f0",
      a1: 55,
      c2: "#64748b",
      a2: 48,
      bc: "#f8fafc",
      ba: 55,
      bw: 1,
      rim: 34,
      gloss: 40,
      reflectAngle: 28,
      reflectWidth: 5,
      reflectAlpha: 62,
      elevation: 30,
      text: "#0f172a",
      solid: "#e2e8f0",
    },
    dark: {
      name: "Dark Glass",
      label: "Dark glass",
      radius: 16,
      padX: 22,
      padY: 12,
      blur: 8,
      sat: 130,
      c1: "#134e4a",
      a1: 55,
      c2: "#082f49",
      a2: 62,
      bc: "#22d3ee",
      ba: 55,
      bw: 1,
      rim: 24,
      gloss: 20,
      reflectAngle: 32,
      reflectWidth: 8,
      reflectAlpha: 30,
      elevation: 26,
      text: "#ecfeff",
      solid: "#083344",
    },
  };

  var RANGES = [
    { group: "Shape", id: "radius", label: "Radius", min: 0, max: 32, unit: "px" },
    { group: "Shape", id: "padX", label: "Padding X", min: 10, max: 40, unit: "px" },
    { group: "Shape", id: "padY", label: "Padding Y", min: 6, max: 24, unit: "px" },
    { group: "Glass", id: "blur", label: "Blur", min: 0, max: 24, unit: "px" },
    { group: "Glass", id: "sat", label: "Saturation", min: 80, max: 200, unit: "%" },
    { group: "Glass", id: "a1", label: "Tint A alpha", min: 0, max: 100, unit: "%" },
    { group: "Glass", id: "a2", label: "Tint B alpha", min: 0, max: 100, unit: "%" },
    { group: "Edge", id: "ba", label: "Border alpha", min: 0, max: 100, unit: "%" },
    { group: "Edge", id: "bw", label: "Border width", min: 0, max: 4, unit: "px" },
    { group: "Edge", id: "rim", label: "Rim", min: 0, max: 60, unit: "%" },
    { group: "Light", id: "gloss", label: "Gloss", min: 0, max: 60, unit: "%" },
    { group: "Light", id: "reflectAngle", label: "Reflection angle", min: 0, max: 180, unit: "°" },
    { group: "Light", id: "reflectWidth", label: "Reflection width", min: 2, max: 20, unit: "%" },
    { group: "Light", id: "reflectAlpha", label: "Reflection strength", min: 0, max: 80, unit: "%" },
    { group: "Depth", id: "elevation", label: "Elevation", min: 0, max: 100, unit: "%" },
  ];

  var COLORS = [
    { id: "c1", label: "Tint A" },
    { id: "c2", label: "Tint B" },
    { id: "bc", label: "Border" },
    { id: "text", label: "Text" },
    { id: "solid", label: "Solid fallback" },
  ];

  var state = Object.assign({}, PRESETS.frosted);
  var activePreset = "frosted";
  var stageSample = [36, 92, 130];

  function $(id) {
    return document.getElementById(id);
  }

  function hexToRgb(hex) {
    var h = String(hex).replace("#", "");
    if (h.length !== 6) return [0, 0, 0];
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }

  function rgba(hex, alphaPercent) {
    var rgb = hexToRgb(hex);
    var a = Math.max(0, Math.min(1, alphaPercent / 100));
    return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + a.toFixed(3) + ")";
  }

  function channel(c) {
    var x = c / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function luminance(rgb) {
    return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
  }

  function contrast(a, b) {
    var l1 = luminance(a);
    var l2 = luminance(b);
    var hi = Math.max(l1, l2);
    var lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function composite(fg, alpha, bg) {
    return fg.map(function (c, i) {
      return Math.round(c * alpha + bg[i] * (1 - alpha));
    });
  }

  function glassColor() {
    var top = composite(hexToRgb(state.c1), state.a1 / 100, stageSample);
    var bottom = composite(hexToRgb(state.c2), state.a2 / 100, stageSample);
    return top.map(function (c, i) {
      return Math.round((c + bottom[i]) / 2);
    });
  }

  function varsFrom(s) {
    var elev = s.elevation / 100;
    var glossA = (s.gloss / 100).toFixed(3);
    var glossB = (s.gloss / 260).toFixed(3);
    var darkText = luminance(hexToRgb(s.text)) < 0.4;
    return {
      "--btn-radius": s.radius + "px",
      "--btn-pad-x": s.padX + "px",
      "--btn-pad-y": s.padY + "px",
      "--blur": s.blur + "px",
      "--sat": s.sat + "%",
      "--bg1": rgba(s.c1, s.a1),
      "--bg2": rgba(s.c2, s.a2),
      "--border-color": rgba(s.bc, s.ba),
      "--border-w": s.bw + "px",
      "--rim-alpha": (s.rim / 100).toFixed(2),
      "--text": s.text,
      "--fg-solid": s.solid,
      "--gloss":
        "linear-gradient(180deg, rgba(255,255,255," +
        glossA +
        ") 0%, rgba(255,255,255," +
        glossB +
        ") 18%, rgba(255,255,255,0) 42%)",
      "--reflect-angle": s.reflectAngle + "deg",
      "--reflect-width": s.reflectWidth + "%",
      "--reflect-alpha": (s.reflectAlpha / 100).toFixed(2),
      "--elev-offset": (2 + 10 * elev).toFixed(1) + "px",
      "--elev-blur": (4 + 20 * elev).toFixed(1) + "px",
      "--elev-alpha": (0.15 + 0.25 * elev).toFixed(3),
      "--text-shadow": darkText
        ? "0 1px 0 rgba(255,255,255,0.45)"
        : "0 1px 1px rgba(0,0,0,0.45)",
    };
  }

  function renderControls() {
    var host = $("builder-controls");
    var groups = [];
    RANGES.forEach(function (range) {
      if (groups.indexOf(range.group) === -1) groups.push(range.group);
    });

    var presets =
      '<div class="preset-row" role="radiogroup" aria-label="Button presets">' +
      Object.keys(PRESETS)
        .map(function (key) {
          return (
            '<button type="button" class="docs-btn" role="radio" data-preset="' +
            key +
            '" aria-checked="false">' +
            PRESETS[key].name +
            "</button>"
          );
        })
        .join("") +
      "</div>";

    var fields = groups
      .map(function (group) {
        var ranges = RANGES.filter(function (range) {
          return range.group === group;
        })
          .map(function (range) {
            return (
              '<label class="ctrl" for="b-' +
              range.id +
              '"><span>' +
              range.label +
              '</span><span class="ctrl-val" id="val-' +
              range.id +
              '"></span><input id="b-' +
              range.id +
              '" data-key="' +
              range.id +
              '" type="range" min="' +
              range.min +
              '" max="' +
              range.max +
              '" step="1"></label>'
            );
          })
          .join("");
        var colors =
          group === "Glass"
            ? COLORS.filter(function (c) {
                return c.id === "c1" || c.id === "c2";
              })
            : group === "Edge"
              ? COLORS.filter(function (c) {
                  return c.id === "bc";
                })
              : group === "Depth"
                ? COLORS.filter(function (c) {
                    return c.id === "text" || c.id === "solid";
                  })
                : [];
        var colorHtml = colors
          .map(function (color) {
            return (
              '<label class="ctrl ctrl-color" for="b-' +
              color.id +
              '"><span>' +
              color.label +
              '</span><input id="b-' +
              color.id +
              '" data-key="' +
              color.id +
              '" type="color"></label>'
            );
          })
          .join("");
        return (
          "<fieldset><legend>" +
          group +
          "</legend>" +
          ranges +
          colorHtml +
          "</fieldset>"
        );
      })
      .join("");

    host.innerHTML =
      '<label class="ctrl" for="b-label"><span>Label</span><input id="b-label" data-key="label" type="text" maxlength="40"></label>' +
      presets +
      fields;

    host.querySelectorAll("[data-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyPreset(button.getAttribute("data-preset"));
      });
    });
    host.querySelectorAll("[data-key]").forEach(function (input) {
      input.addEventListener("input", function () {
        var key = input.getAttribute("data-key");
        state[key] = input.type === "range" ? Number(input.value) : input.value;
        activePreset = null;
        paint();
      });
    });
  }

  function applyPreset(key) {
    state = Object.assign({}, PRESETS[key]);
    activePreset = key;
    syncInputs();
    paint();
  }

  function syncInputs() {
    document.querySelectorAll("#builder-controls [data-key]").forEach(function (input) {
      var key = input.getAttribute("data-key");
      if (state[key] !== undefined) input.value = state[key];
    });
  }

  function paint() {
    var button = $("preview-btn");
    var vars = varsFrom(state);
    Object.keys(vars).forEach(function (key) {
      button.style.setProperty(key, vars[key]);
    });
    button.textContent = state.label || "Button";

    RANGES.forEach(function (range) {
      var node = $("val-" + range.id);
      if (node) node.textContent = state[range.id] + range.unit;
    });

    document.querySelectorAll("[data-preset]").forEach(function (node) {
      var on = node.getAttribute("data-preset") === activePreset;
      node.setAttribute("aria-checked", on ? "true" : "false");
    });

    var glass = glassColor();
    var solid = hexToRgb(state.solid);
    var text = hexToRgb(state.text);
    var glassRatio = contrast(text, glass);
    var solidRatio = contrast(text, solid);
    var worst = Math.min(glassRatio, solidRatio);
    var badge = $("contrast");
    var pass = worst >= 4.5;
    badge.className = pass ? "contrast pass" : "contrast fail";
    badge.textContent =
      (pass ? "AA " : "Below AA ") +
      glassRatio.toFixed(2) +
      ":1 on glass · " +
      solidRatio.toFixed(2) +
      ":1 on the solid fallback";

    $("css-out").textContent = variableCss();
  }

  function variableCss() {
    var vars = varsFrom(state);
    return (
      ".frost-btn-glass {\n" +
      Object.keys(vars)
        .map(function (key) {
          return "  " + key + ": " + vars[key] + ";";
        })
        .join("\n") +
      "\n}"
    );
  }

  function standaloneCss() {
    return (
      "/* Frost Glass button\n" +
      " * Generated by the Frost Glass docs builder.\n" +
      " * Gloss, reflection stripe, rim, and elevation follow Frosty40's\n" +
      " * bbuilder studies. https://github.com/newjordan/Frost-Glass\n" +
      " */\n" +
      variableCss() +
      "\n\n" +
      ".frost-btn-glass {\n" +
      "  display: inline-flex;\n" +
      "  align-items: center;\n" +
      "  justify-content: center;\n" +
      "  padding: var(--btn-pad-y) var(--btn-pad-x);\n" +
      "  border-radius: var(--btn-radius);\n" +
      "  border: var(--border-w) solid var(--border-color);\n" +
      "  color: var(--text);\n" +
      "  font: 600 0.95rem/1.2 system-ui, sans-serif;\n" +
      "  text-shadow: var(--text-shadow);\n" +
      "  background-color: var(--fg-solid);\n" +
      "  background-image:\n" +
      "    linear-gradient(var(--reflect-angle), transparent calc(50% - var(--reflect-width) / 2), rgba(255,255,255, var(--reflect-alpha)) 50%, transparent calc(50% + var(--reflect-width) / 2)),\n" +
      "    var(--gloss),\n" +
      "    linear-gradient(135deg, var(--bg1), var(--bg2));\n" +
      "  background-blend-mode: screen, screen, normal;\n" +
      "  -webkit-backdrop-filter: blur(var(--blur)) saturate(var(--sat));\n" +
      "  backdrop-filter: blur(var(--blur)) saturate(var(--sat));\n" +
      "  box-shadow:\n" +
      "    0 var(--elev-offset) var(--elev-blur) rgba(0, 0, 0, var(--elev-alpha)),\n" +
      "    inset 0 1px 0 rgba(255, 255, 255, 0.35),\n" +
      "    inset 0 0 0 2px rgba(255, 255, 255, var(--rim-alpha));\n" +
      "}\n" +
      "@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {\n" +
      "  .frost-btn-glass { background-image: none; -webkit-backdrop-filter: none; backdrop-filter: none; }\n" +
      "}\n" +
      "@media (prefers-reduced-transparency: reduce) {\n" +
      "  .frost-btn-glass { background-image: none; -webkit-backdrop-filter: none; backdrop-filter: none; }\n" +
      "}\n" +
      "@media (prefers-reduced-motion: reduce) {\n" +
      "  .frost-btn-glass:hover, .frost-btn-glass:active { transform: none; }\n" +
      "}\n"
    );
  }

  function copyText(text, button) {
    var done = function () {
      var previous = button.textContent;
      button.textContent = "Copied";
      setTimeout(function () {
        button.textContent = previous;
      }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text);
        done();
      });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  function bestText() {
    var options = ["#0f172a", "#f8fafc"];
    var glass = glassColor();
    var solid = hexToRgb(state.solid);
    var winner = options[0];
    var best = -1;
    options.forEach(function (hex) {
      var rgb = hexToRgb(hex);
      var score = Math.min(contrast(rgb, glass), contrast(rgb, solid));
      if (score > best) {
        best = score;
        winner = hex;
      }
    });
    state.text = winner;
    activePreset = null;
    syncInputs();
    paint();
  }

  function init() {
    if (!$("builder-controls") || !$("preview-btn")) return;
    renderControls();
    syncInputs();
    paint();
    $("fix-contrast").addEventListener("click", bestText);
    $("copy-vars").addEventListener("click", function () {
      copyText(variableCss(), $("copy-vars"));
    });
    $("copy-standalone").addEventListener("click", function () {
      copyText(standaloneCss(), $("copy-standalone"));
    });
    var reduce = window.matchMedia("(prefers-reduced-transparency: reduce)");
    var note = $("transparency-note");
    var show = function () {
      note.hidden = !reduce.matches;
    };
    show();
    if (reduce.addEventListener) reduce.addEventListener("change", show);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
