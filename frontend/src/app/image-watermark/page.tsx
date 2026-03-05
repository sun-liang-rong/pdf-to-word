import { Metadata } from "next";
import ImageWatermarkClient from "./client-page";

export const metadata: Metadata = {
  title: "图片加水印 - 在线图片文字水印工具",
  description: "免费在线图片加水印工具，支持文字水印、自定义位置、透明度调节、旋转角度设置，保护您的图片版权。",
  keywords: "图片水印,加水印,文字水印,图片版权保护,在线水印工具",
  openGraph: {
    title: "图片加水印 - 在线图片文字水印工具",
    description: "免费在线图片加水印工具，支持多种样式设置",
    type: "website",
  },
};

export default function ImageWatermarkPage() {
  return <ImageWatermarkClient />;
}
