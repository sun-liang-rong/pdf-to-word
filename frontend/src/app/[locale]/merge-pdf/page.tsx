import { Metadata } from "next";
import MergePdfClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "PDF合并 - 免费在线合并多个PDF文件";
const description = "免费在线合并多个PDF文件，支持拖拽排序、去除证书签名、生成目录等功能，快速、安全、无需注册。";
const keywords = "PDF合并,合并PDF,PDF合并工具,在线PDF合并,免费PDF合并";
const path = "/merge-pdf";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF合并工具",
  description,
  url: `${siteUrl}${path}`,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
  },
};

export default function MergePdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MergePdfClient />
    </>
  );
}
