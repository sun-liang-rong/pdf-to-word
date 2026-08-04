import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const cssPath = new URL("../src/app/globals.css", import.meta.url);
const headerPath = new URL("../src/components/layout/Header.tsx", import.meta.url);

test("desktop tools menu stays within the viewport and scrolls", async () => {
  const css = await readFile(cssPath, "utf8");
  const menuRule = css.match(/\.studio-mega-menu\s*\{([\s\S]*?)\}/)?.[1] ?? "";

  assert.match(menuRule, /max-height:\s*calc\(100dvh\s*-\s*[^)]+\)/);
  assert.match(menuRule, /overflow-y:\s*auto/);
  assert.match(menuRule, /overscroll-behavior:\s*contain/);
});

test("mobile all-tools menu includes image tools", async () => {
  const header = await readFile(headerPath, "utf8");
  const mobileMenu = header.split("{isMenuOpen && (")[1] ?? "";

  assert.match(mobileMenu, /imageTools\.map/);
});
