import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo-config";
import PdfWatermarkClient from "./client-page";

export const metadata: Metadata = generateMetadata("PDF加水印 - 免费在线文字水印工具", "为PDF添加自定义文字水印，支持颜色、透明度、旋转角度和间距设置。", "PDF水印,PDF加文字水印,在线PDF工具", "/pdf-watermark");

export default function PdfWatermarkPage() { return <PdfWatermarkClient />; }
