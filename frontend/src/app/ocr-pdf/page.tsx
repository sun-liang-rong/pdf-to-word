import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("扫描PDF OCR - 免费在线文字识别", "让扫描件变成可搜索、可复制的 PDF，支持中英文混合识别。", "OCR PDF,扫描件识别,文字识别", "/ocr-pdf");
export default function Page(){return <Client/>}
