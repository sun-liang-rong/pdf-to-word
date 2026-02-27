import { Metadata } from "next";
import PdfToJpgClient from "./client-page";

export const metadata: Metadata = {
  title: "PDF转JPG在线转换 - 免费PDF转图片工具",
  description: "免费在线PDF转JPG转换器，将PDF文件的每一页转换为高清JPG图片，支持批量下载。",
  keywords: "PDF转JPG,PDF to JPG,PDF转图片,在线PDF转JPG,免费PDF转图片",
  openGraph: {
    title: "PDF转JPG在线转换 - 免费PDF转图片工具",
    description: "免费在线PDF转JPG转换器，将PDF转换为高清图片",
    type: "website",
  },
};

export default function PdfToJpgPage() {
  return <PdfToJpgClient />;
}
