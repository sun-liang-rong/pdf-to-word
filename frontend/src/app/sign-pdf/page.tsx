import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("PDF在线签名 - 免费添加手写签名", "上传手写签名 PNG、JPG 或 SVG，并放置到 PDF 指定坐标。", "PDF签名,在线签名", "/sign-pdf");
export default function Page(){return <Client/>}
