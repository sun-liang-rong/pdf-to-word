import { Metadata } from "next";
import PdfToWordClient from "./client-page";

export const metadata: Metadata = {
  title: "PDF转Word在线转换 - 免费快速PDF转Word工具",
  description: "免费在线PDF转Word转换器，将PDF文件转换为可编辑的Word文档(.docx)，保留原有格式和排版，无需注册，即用即走。",
  keywords: "PDF转Word,PDF to Word,PDF转换Word,在线PDF转Word,免费PDF转Word",
  openGraph: {
    title: "PDF转Word在线转换 - 免费快速PDF转Word工具",
    description: "免费在线PDF转Word转换器，将PDF文件转换为可编辑的Word文档",
    type: "website",
  },
};

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
