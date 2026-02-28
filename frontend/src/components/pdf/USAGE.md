# PDFViewer 组件使用指南

## 已创建的文件

1. **`PDFViewer.tsx`** - 主组件 (520 行)
2. **`PDFViewer.example.tsx`** - 使用示例
3. **`README.md`** - 完整文档

## 在项目中集成 PDFViewer

### 场景 1: 简单的 PDF 文件预览

如果您需要一个简单的 PDF 预览功能（例如预览上传的文件），可以直接使用：

```tsx
import PDFViewer, { PDFSource } from '@/components/pdf/PDFViewer';

export default function SimplePreview() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      {file && (
        <PDFViewer 
          source={{ type: 'file', file }}
          showToolbar={true}
          showNavigation={true}
          showZoom={true}
          showDownload={true}
          showPrint={true}
          showFullscreen={true}
          className="h-[600px]"
        />
      )}
    </div>
  );
}
```

### 场景 2: 预览转换后的 PDF

如果您需要预览转换后的 PDF 文件（例如从 Word 转换而来）：

```tsx
import PDFViewer from '@/components/pdf/PDFViewer';

export default function ConvertedPDFPreview({ taskId }: { taskId: string }) {
  const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/download/${taskId}`;
  
  return (
    <PDFViewer 
      source={{ type: 'url', url: pdfUrl }}
      defaultScale={1}
      showToolbar={true}
      showNavigation={true}
      showZoom={true}
      showDownload={true}
      showPrint={true}
      showFullscreen={true}
      className="h-[800px]"
    />
  );
}
```

### 场景 3: Base64 PDF 预览

如果需要预览 Base64 编码的 PDF：

```tsx
import PDFViewer from '@/components/pdf/PDFViewer';

export default function Base64Preview({ base64Data }: { base64Data: string }) {
  return (
    <PDFViewer 
      source={{ type: 'base64', data: base64Data }}
      showToolbar={true}
      showNavigation={true}
      className="h-[600px]"
    />
  );
}
```

## 为什么 split-pdf 和 remove-pages 页面没有替换？

`split-pdf` 和 `remove-pages` 页面使用了**缩略图网格预览**，这是为了：

1. **可视化选择**：用户需要看到所有页面的缩略图来选择要拆分/删除的页面
2. **范围设置**：用户需要直观地看到每个范围包含哪些页面
3. **交互需求**：需要点击缩略图来选择/取消选择页面

这些页面的预览逻辑是**专门为页面选择场景设计的**，不适合用完整的 PDFViewer 替换。

## 推荐使用 PDFViewer 的场景

✅ **适合使用 PDFViewer 的场景**：
- 单个 PDF 文件的完整预览
- 转换结果预览
- 文档查看器
- 简单的 PDF 阅读

❌ **不适合使用 PDFViewer 的场景**：
- 需要选择特定页面
- 需要显示所有页面缩略图
- 需要页面级别的交互（选择、拖拽等）

## 快速开始

1. 导入组件：
```tsx
import PDFViewer, { PDFSource } from '@/components/pdf/PDFViewer';
```

2. 创建 PDF 源：
```tsx
const source: PDFSource = { type: 'file', file: myFile };
// 或
const source: PDFSource = { type: 'url', url: 'https://example.com/doc.pdf' };
// 或
const source: PDFSource = { type: 'base64', data: base64String };
```

3. 渲染组件：
```tsx
<PDFViewer source={source} />
```

就这么简单！

## 自定义配置

所有可用的配置选项：

```tsx
<PDFViewer 
  source={source}
  // 基础配置
  defaultScale={1}           // 默认缩放比例
  initialPage={1}            // 初始页码
  
  // 工具栏显示控制
  showToolbar={true}         // 显示工具栏
  showNavigation={true}      // 显示页面导航
  showZoom={true}            // 显示缩放控制
  showDownload={true}        // 显示下载按钮
  showPrint={true}           // 显示打印按钮
  showFullscreen={true}      // 显示全屏按钮
  
  // 自动适配
  autoFitWidth={false}       // 自动适应宽度
  
  // 样式
  className="h-[600px]"      // 自定义类名
  
  // 回调函数
  onLoadSuccess={(count) => console.log('共', count, '页')}
  onPageChange={(page) => console.log('当前第', page, '页')}
  onScaleChange={(scale) => console.log('缩放比例', scale)}
/>
```

## 快捷键

- `←` / `→` - 上一页 / 下一页
- `+` / `=` - 放大
- `-` - 缩小

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Opera 67+

## 注意事项

### 1. PDF.js Worker 配置

组件已经自动配置了 worker，无需额外设置：

```tsx
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
```

### 2. CORS 问题

加载在线 PDF 时，确保服务器允许跨域访问。

### 3. 文件大小

建议限制上传文件大小（如 20MB）以避免性能问题。

## 示例代码位置

- 组件：`src/components/pdf/PDFViewer.tsx`
- 示例：`src/components/pdf/PDFViewer.example.tsx`
- 文档：`src/components/pdf/README.md`
