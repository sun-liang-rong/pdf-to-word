import { Metadata } from "next";
import ImageCompressClient from "./client-page";

export const metadata: Metadata = {
  title: "图片压缩在线工具 - 免费图片压缩",
  description: "免费在线图片压缩工具，支持 JPG、PNG、WebP 格式压缩，可调整压缩质量，保持最佳画质。",
  keywords: "图片压缩,在线图片压缩,JPG压缩,PNG压缩,WebP压缩,免费图片压缩",
  openGraph: {
    title: "图片压缩在线工具 - 免费图片压缩",
    description: "免费在线图片压缩工具，支持多种格式",
    type: "website",
  },
};

export default function ImageCompressPage() {
  return <ImageCompressClient />;
}
