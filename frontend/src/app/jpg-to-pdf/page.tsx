import { Metadata } from "next";
import JpgToPdfClient from "./client-page";

export const metadata: Metadata = {
  title: "JPG转PDF在线转换 - 免费图片转PDF工具",
  description: "免费在线JPG转PDF转换器，将JPG、PNG图片转换为PDF文件，支持多图合并，保持高清画质。",
  keywords: "JPG转PDF,JPG to PDF,图片转PDF,在线JPG转PDF,免费图片转PDF",
  openGraph: {
    title: "JPG转PDF在线转换 - 免费图片转PDF工具",
    description: "免费在线JPG转PDF转换器，将图片转换为PDF文件",
    type: "website",
  },
};

export default function JpgToPdfPage() {
  return <JpgToPdfClient />;
}
