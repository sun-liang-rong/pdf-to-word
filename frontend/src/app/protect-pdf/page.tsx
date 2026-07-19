import { Metadata } from "next"; import { generateMetadata } from "@/lib/seo-config"; import Client from "./client-page";
export const metadata: Metadata = generateMetadata("PDF加密 - 免费在线设置密码", "为 PDF 设置打开密码与访问权限，保护敏感文档。", "PDF加密,PDF设置密码", "/protect-pdf");
export default function Page(){return <Client/>}
