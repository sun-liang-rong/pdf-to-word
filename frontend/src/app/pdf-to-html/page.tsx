import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("PDF 转 HTML - 免费在线工具", "将 PDF 内容转换为 HTML 网页资源压缩包。", "PDF 转 HTML,在线PDF工具", "/pdf-to-html");
export default function Page(){return <Client/>}
