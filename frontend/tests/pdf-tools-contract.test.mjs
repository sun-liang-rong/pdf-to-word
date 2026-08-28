import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("special PDF tools use dedicated endpoints", async () => {
  const pages = {
    "compress-pdf": ["endpoint=\"compress\"", "optimizeLevel"],
    "remove-pages": ["endpoint=\"remove-pages\"", "pageNumbers"],
    "split-pdf": ["endpoint=\"split-pages\"", "mergeAll"],
    "rearrange-pdf": ["endpoint=\"rearrange-pages\"", "customMode"],
  };

  for (const [page, expectations] of Object.entries(pages)) {
    const source = await read(`src/app/${page}/client-page.tsx`);
    for (const expectation of expectations) assert.match(source, new RegExp(expectation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), page);
    assert.doesNotMatch(source, /ConversionPageTemplate/);
  }
});

test("merge page submits files field and requires two files", async () => {
  const source = await read("src/app/merge-pdf/client-page.tsx");
  assert.match(source, /convert\/merge/);
  assert.match(source, /append\("files"/);
  assert.match(source, /files\.length\s*<\s*2/);
  assert.match(source, /MergeOptions/);
  assert.match(source, /MultiFileUploader/);
});

test("page expression input preserves backend expression strings", async () => {
  const source = await read("src/components/remove-pages/PageExpressionInput.tsx");
  assert.match(source, /onExpressionChange: \(expression: string, pages: number\[\]\)/);
  assert.match(source, /onExpressionChange\(value\.trim\(\)/);
  assert.match(source, /trimmed\.toLowerCase\(\) === "all"/);
});

test("image watermark keeps a live preview tied to watermark controls", async () => {
  const source = await read("src/app/image-watermark/client-page.tsx");
  assert.match(source, /实时预览/);
  assert.match(source, /previewRef/);
  assert.match(source, /setImageSize\(\{ width: event\.currentTarget\.naturalWidth/);
  assert.match(source, /tileSpacing/);
  assert.match(source, /快速预设/);
  assert.match(source, /水印位置/);
  assert.match(source, /watermarkPresets/);
  assert.match(source, /水印成品/);
  assert.match(source, /\? result\.downloadUrl/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_API_URL\}\$\{result\.downloadUrl\}/);
});

test("frontend proxies generated image files without the API prefix", async () => {
  const config = await read("next.config.ts");
  assert.match(config, /source: '\/uploads\/:path\*'/);
  assert.match(config, /destination: `\$\{backendOrigin\}\/uploads\/:path\*`/);
});

test("image compression offers preview, presets, resizing, and result comparison", async () => {
  const source = await read("src/app/image-compress/client-page.tsx");
  assert.match(source, /原图预览/);
  assert.match(source, /压缩方案/);
  assert.match(source, /maxWidth/);
  assert.match(source, /formData\.append\("maxWidth", maxWidth\)/);
  assert.match(source, /压缩前/);
  assert.match(source, /压缩后/);
});
