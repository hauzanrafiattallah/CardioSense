import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const globalCss = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);

test("global text selection uses a calm non-red highlight", () => {
  assert.match(globalCss, /::selection\s*{/);
  assert.match(globalCss, /background:\s*color-mix\(in srgb, var\(--cardio-cyan\) 32%, transparent\);/);
  assert.doesNotMatch(globalCss, /::selection\s*{[^}]*var\(--cardio-red\)/s);
  assert.doesNotMatch(globalCss, /::selection\s*{[^}]*var\(--cardio-coral\)/s);
});
