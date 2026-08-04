import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("调整 PDF 页面尺寸 - 免费在线工具", "缩放页面内容并统一为 A4、Letter、Legal 等标准纸张尺寸。", "调整 PDF 页面尺寸,在线PDF工具", "/scale-pdf");
export default function Page(){return <Client/>}
