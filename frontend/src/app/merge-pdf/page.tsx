import { Metadata } from "next";
import MergePdfClient from "./client-page";

export const metadata: Metadata = {
  title: "PDF合并 - 免费在线合并多个PDF文件",
  description: "免费在线合并多个PDF文件，支持拖拽排序、去除证书签名、生成目录等功能，快速、安全、无需注册。",
};

export default function MergePdfPage() {
  return <MergePdfClient />;
}
