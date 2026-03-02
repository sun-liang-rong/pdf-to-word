import { Metadata } from "next";
import PdfToWordClient from "./client-page";

export const metadata: Metadata = {
  title: "PDF 转 Word 在线转换 - 免费快速 PDF 转 Word 工具",
  description: "免费在线 PDF 转 Word 转换器，将 PDF 文件转换为可编辑的 Word 文档 (.doc)，保留原有格式和排版，无需注册，即用即走。",
  keywords: "PDF 转 Word,PDF to Word,PDF 转换 Word，在线 PDF 转 Word，免费 PDF 转 Word",
  openGraph: {
    title: "PDF 转 Word 在线转换 - 免费快速 PDF 转 Word 工具",
    description: "免费在线 PDF 转 Word 转换器，将 PDF 文件转换为可编辑的 Word 文档",
    type: "website",
  },
};

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
