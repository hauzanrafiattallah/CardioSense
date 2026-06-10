import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const footerRelatedSources = [
  "../src/features/home/components/Footer.tsx",
  "../src/components/shared/Disclaimer.tsx",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

const footerBackground = "#91222b";
const minimumSmallTextContrast = 4.5;

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function mixWithBackground(foreground, background, alpha) {
  return {
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
  };
}

function linearize(channel) {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color) {
  return (
    0.2126 * linearize(color.r) +
    0.7152 * linearize(color.g) +
    0.0722 * linearize(color.b)
  );
}

function contrastRatio(first, second) {
  const firstLum = relativeLuminance(first);
  const secondLum = relativeLuminance(second);
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);

  return (lighter + 0.05) / (darker + 0.05);
}

test("footer muted text colors keep readable contrast on the footer background", () => {
  const white = hexToRgb("#ffffff");
  const background = hexToRgb(footerBackground);
  const mutedWhiteClasses = footerRelatedSources.flatMap((source) => [
    ...source.matchAll(/text-white\/(\d+)/g),
  ]);

  assert.ok(mutedWhiteClasses.length > 0, "Expected footer muted text classes");

  for (const [, opacity] of mutedWhiteClasses) {
    const alpha = Number(opacity) / 100;
    const renderedColor = mixWithBackground(white, background, alpha);
    const contrast = contrastRatio(renderedColor, background);

    assert.ok(
      contrast >= minimumSmallTextContrast,
      `text-white/${opacity} contrast ${contrast.toFixed(2)} is below ${minimumSmallTextContrast}:1`,
    );
  }
});
