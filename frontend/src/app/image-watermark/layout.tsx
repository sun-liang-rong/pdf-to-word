import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "图片水印在线工具",
  description: "为图片添加文字水印并实时预览。",
};

export default function ImageWatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
