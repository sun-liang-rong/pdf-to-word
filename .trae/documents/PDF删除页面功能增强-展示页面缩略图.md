# PDF 删除页面功能增强 - 展示页面缩略图

## 需求
在删除页面功能中，展示 PDF 每一页的实际内容缩略图，而不是只显示页码。

## 实现方案

### 1. 安装 PDF.js
```bash
pnpm install pdfjs-dist
```

### 2. 创建 PDF 预览组件
**文件**: `frontend/src/components/remove-pages/PDFThumbnail.tsx`
- 使用 PDF.js 渲染 PDF 页面为 Canvas
- 生成缩略图
- 支持加载状态

### 3. 更新 PageSelector 组件
**文件**: `frontend/src/components/remove-pages/PageSelector.tsx`
- 集成 PDFThumbnail 组件
- 展示实际页面内容
- 保持选择功能

### 4. 更新主页面
**文件**: `frontend/src/app/remove-pages/client-page.tsx`
- 上传 PDF 后解析文件
- 获取真实页数
- 传递 PDF 文件给 PageSelector

## 技术细节

### PDF.js 使用方式
```typescript
import * as pdfjs from 'pdfjs-dist';

// 加载 PDF
const pdf = await pdfjs.getDocument(file.arrayBuffer()).promise;

// 获取页数
const pageCount = pdf.numPages;

// 渲染页面
const page = await pdf.getPage(pageNum);
const viewport = page.getViewport({ scale: 0.5 });
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.height = viewport.height;
canvas.width = viewport.width;

await page.render({
  canvasContext: context,
  viewport: viewport
}).promise;
```

### 性能优化
1. **懒加载**: 只渲染可见区域的页面
2. **缓存**: 已渲染的页面缓存起来
3. **低分辨率**: 缩略图使用较小的 scale (0.3-0.5)
4. **Web Worker**: 使用 PDF.js 的 worker 避免阻塞主线程

## 文件清单

### 需要新建的文件
1. `frontend/src/components/remove-pages/PDFThumbnail.tsx`

### 需要修改的文件
1. `frontend/src/components/remove-pages/PageSelector.tsx`
2. `frontend/src/app/remove-pages/client-page.tsx`
3. `frontend/package.json` (添加 pdfjs-dist 依赖)
