import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo-config";
import ExtractPagesClient from "./client-page";

export const metadata: Metadata = generateMetadata("提取PDF页面 - 在线选择并导出页面", "从PDF中提取指定页面并生成一个新的PDF文件，支持页码和范围组合。", "提取PDF页面,PDF页面导出,PDF工具", "/extract-pages");

export default function ExtractPagesPage() { return <ExtractPagesClient />; }
