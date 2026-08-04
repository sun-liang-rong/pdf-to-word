import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("裁剪PDF - 免费在线页面裁剪", "自动移除白边，或按坐标精确裁剪所有页面。", "裁剪PDF,PDF去白边", "/crop-pdf");
export default function Page(){return <Client/>}
