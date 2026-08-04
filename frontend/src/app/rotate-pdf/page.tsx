import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo-config";
import RotatePdfClient from "./client-page";

export const metadata: Metadata = generateMetadata("旋转PDF - 免费在线旋转PDF页面", "免费在线旋转整个PDF文档，支持90、180和270度旋转。", "旋转PDF,PDF页面旋转,在线PDF工具", "/rotate-pdf");

export default function RotatePdfPage() { return <RotatePdfClient />; }
