import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("PDF 转 Excel - 免费在线工具", "提取 PDF 表格并导出为可编辑 XLSX 工作簿。", "PDF 转 Excel,在线PDF工具", "/pdf-to-excel");
export default function Page(){return <Client/>}
