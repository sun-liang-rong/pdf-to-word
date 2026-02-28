import type { Metadata } from 'next';
import RearrangePdfClient from './client-page';

export const metadata: Metadata = {
  title: 'PDF 页面排序 - 免费在线 PDF 重新排列工具',
  description: '免费在线 PDF 页面排序工具，支持拖拽排序、自动排列模式。可视化调整 PDF 页面顺序，快速生成新的 PDF 文件。',
  keywords: 'PDF 排序，PDF 页面排序，PDF 重新排列，PDF 工具，在线 PDF',
};

export default function RearrangePdfPage() {
  return <RearrangePdfClient />;
}
