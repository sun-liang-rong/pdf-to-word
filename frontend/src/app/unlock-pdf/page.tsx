import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("PDF解密 - 免费在线移除密码", "使用已知密码移除 PDF 保护，生成可直接打开的副本。", "PDF解密,移除PDF密码", "/unlock-pdf");
export default function Page(){return <Client/>}
