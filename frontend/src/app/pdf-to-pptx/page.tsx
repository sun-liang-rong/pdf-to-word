import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("PDF 转 PowerPoint - 免费在线工具", "将 PDF 页面转换为可编辑的 PPTX 演示文稿。", "PDF 转 PowerPoint,在线PDF工具", "/pdf-to-pptx");
export default function Page(){return <Client/>}
