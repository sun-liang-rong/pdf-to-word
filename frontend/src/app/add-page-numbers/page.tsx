import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("添加页码与页眉页脚 - 免费在线工具", "使用自定义文字模板，在页面九宫格位置添加页码、页眉或页脚。", "添加页码与页眉页脚,在线PDF工具", "/add-page-numbers");
export default function Page(){return <Client/>}
