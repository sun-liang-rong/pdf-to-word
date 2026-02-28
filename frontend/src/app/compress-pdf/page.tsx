import { Metadata } from "next";
import CompressPdfClient from "./client-page";

export const metadata: Metadata = {
  title: "PDF压缩 - 免费在线压缩PDF文件",
  description: "免费在线压缩PDF文件，支持多种压缩选项，包括优化等级、线性化、灰度化、高对比度线稿转换等功能。",
};

export default function CompressPdfPage() {
  return <CompressPdfClient />;
}
