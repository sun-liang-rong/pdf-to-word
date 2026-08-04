# PDFViewer 组件文档

## 概述

PDFViewer 是一个功能完整的可复用 PDF 预览组件，支持多种 PDF 加载方式、丰富的交互功能和响应式设计。

## 功能特性

### 1. 多种加载方式
- ✅ **文件上传预览**: 支持本地 PDF 文件上传并预览
- ✅ **在线 PDF 链接预览**: 通过 URL 加载在线 PDF 文件
- ✅ **Base64 格式预览**: 支持 Base64 编码的 PDF 数据

### 2. 交互功能
- ✅ **页面导航**: 上一页/下一页/首页/末页，支持页码输入跳转
- ✅ **页码显示**: 实时显示当前页码和总页数
- ✅ **缩放控制**: 放大/缩小/重置缩放（50%-300%）
- ✅ **旋转功能**: 顺时针/逆时针旋转 90 度
- ✅ **全屏显示**: 一键切换全屏模式
- ✅ **下载功能**: 下载当前 PDF 文件
- ✅ **打印功能**: 调用浏览器打印功能
- ✅ **键盘导航**: 支持方向键翻页，+/- 缩放

### 3. 响应式设计
- ✅ 适配桌面端和移动端
- ✅ 自适应容器宽度
- ✅ 触摸友好的交互界面

### 4. 错误处理
- ✅ PDF 加载失败提示
- ✅ 文件格式错误提示
- ✅ 友好的错误状态 UI

### 5. 性能优化
- ✅ 页面渲染缓存
- ✅ 懒加载支持
- ✅ 分页渲染

## 安装和使用

### 安装依赖

确保已安装 PDF.js:

```bash
npm install pdfjs-dist
```

### 基本使用

```tsx
import PDFViewer, { PDFSource } from '@/components/pdf/PDFViewer';

// 方式 1: 文件上传
const fileSource: PDFSource = { type: 'file', file: selectedFile };
<PDFViewer source={fileSource} />

// 方式 2: URL 加载
const urlSource: PDFSource = { type: 'url', url: 'https://example.com/document.pdf' };
<PDFViewer source={urlSource} />

// 方式 3: Base64
const base64Source: PDFSource = { type: 'base64', data: 'data:application/pdf;base64,...' };
<PDFViewer source={base64Source} />
```

## Props 接口

### PDFSource 类型

```typescript
type PDFSource = 
  | { type: "file"; file: File }
  | { type: "url"; url: string }
  | { type: "base64"; data: string };
```

### PDFViewerProps 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `source` | `PDFSource` | **必填** | PDF 源（文件/URL/Base64） |
| `defaultScale` | `number` | `1` | 默认缩放比例（1 = 100%） |
| `initialPage` | `number` | `1` | 初始页码（从 1 开始） |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `showNavigation` | `boolean` | `true` | 是否显示页面导航 |
| `showZoom` | `boolean` | `true` | 是否显示缩放控制 |
| `showDownload` | `boolean` | `true` | 是否显示下载按钮 |
| `showPrint` | `boolean` | `true` | 是否显示打印按钮 |
| `showFullscreen` | `boolean` | `true` | 是否显示全屏按钮 |
| `autoFitWidth` | `boolean` | `false` | 是否自动适应宽度 |
| `className` | `string` | `''` | 自定义类名 |
| `onLoadSuccess` | `(pageCount: number) => void` | - | 加载成功回调 |
| `onLoadError` | `(error: Error) => void` | - | 加载失败回调 |
| `onPageChange` | `(page: number) => void` | - | 页面变化回调 |
| `onScaleChange` | `(scale: number) => void` | - | 缩放变化回调 |

## 使用示例

### 示例 1: 基础用法

```tsx
import PDFViewer, { PDFSource } from '@/components/pdf/PDFViewer';
import { useState } from 'react';

export default function SimpleExample() {
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {file && (
        <PDFViewer source={{ type: 'file', file }} />
      )}
    </div>
  );
}
```

### 示例 2: 自定义配置

```tsx
<PDFViewer 
  source={{ type: 'file', file: myFile }}
  defaultScale={1.5}
  initialPage={5}
  showToolbar={true}
  showNavigation={true}
  showZoom={true}
  showDownload={false}
  showPrint={false}
  showFullscreen={true}
  autoFitWidth={true}
  className="h-[800px]"
  onLoadSuccess={(pageCount) => console.log('PDF 共', pageCount, '页')}
  onPageChange={(page) => console.log('当前第', page, '页')}
/>
```

### 示例 3: URL 加载

```tsx
<PDFViewer 
  source={{ 
    type: 'url', 
    url: 'https://example.com/document.pdf' 
  }}
  defaultScale={1}
  showDownload={true}
/>
```

### 示例 4: Base64 加载

```tsx
const base64PDF = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9M...';

<PDFViewer 
  source={{ 
    type: 'base64', 
    data: base64PDF 
  }}
/>
```

## 快捷键

| 按键 | 功能 |
|------|------|
| `←` / `→` | 上一页 / 下一页 |
| `+` / `=` | 放大 |
| `-` | 缩小 |

## 样式定制

### 使用 className 自定义

```tsx
<PDFViewer 
  source={source}
  className="custom-class h-[600px] rounded-xl shadow-2xl"
/>
```

### 覆盖默认样式

在 CSS 文件中添加自定义样式：

```css
.pdf-viewer-toolbar {
  background: linear-gradient(to right, #667eea, #764ba2);
}

.pdf-viewer-canvas {
  border: 2px solid #e5e7eb;
}
```

## 注意事项

### 1. PDF.js Worker 配置

确保在组件中正确配置了 PDF.js worker：

```typescript
import * as pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
```

### 2. CORS 问题

加载在线 PDF 时，确保服务器允许跨域访问：

```
Access-Control-Allow-Origin: *
```

### 3. 文件大小限制

建议限制上传文件的大小（如 20MB）以避免性能问题。

### 4. 移动端优化

在移动端可以考虑：
- 禁用某些功能按钮
- 调整默认缩放比例
- 优化触摸手势

## 浏览器兼容性

| 浏览器 | 版本要求 |
|--------|----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |

## 常见问题

### Q: 如何获取当前页码？
A: 使用 `onPageChange` 回调监听页码变化。

### Q: 如何禁用下载功能？
A: 设置 `showDownload={false}`。

### Q: 如何实现自动播放？
A: 使用 `setInterval` 定时调用 `onPageChange`。

### Q: 如何优化大文件性能？
A: 启用 `autoFitWidth` 并实现懒加载。

## 更新日志

### v1.0.0
- ✅ 初始版本发布
- ✅ 支持文件/URL/Base64 加载
- ✅ 完整的工具栏功能
- ✅ 响应式设计
- ✅ 错误处理
- ✅ 性能优化

## 许可证

MIT License
