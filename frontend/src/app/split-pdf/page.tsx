import type { Metadata } from 'next';
import SplitPdfClient from './client-page';

export const metadata: Metadata = {
  title: 'PDF 页面拆分 - 免费在线 PDF 拆分工具',
  description: '免费在线 PDF 拆分工具，支持单页拆分、多页拆分、批量拆分。可视化选择页面，快速生成独立 PDF 文件。',
  keywords: 'PDF 拆分，PDF 页面拆分，PDF 工具，在线 PDF',
};

export default function SplitPdfPage() {
  return <SplitPdfClient />;
}
