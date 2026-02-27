import { Metadata } from "next";
import WordToPdfClient from "./client-page";

export const metadata: Metadata = {
  title: "Word转PDF在线转换 - 免费快速Word转PDF工具",
  description: "免费在线Word转PDF转换器，将Word文档(.doc/.docx)转换为PDF格式，完美保留原有排版和格式，无需注册。",
  keywords: "Word转PDF,Word to PDF,Word转换PDF,在线Word转PDF,免费Word转PDF",
  openGraph: {
    title: "Word转PDF在线转换 - 免费快速Word转PDF工具",
    description: "免费在线Word转PDF转换器，将Word文档转换为PDF格式",
    type: "website",
  },
};

export default function WordToPdfPage() {
  return <WordToPdfClient />;
}
