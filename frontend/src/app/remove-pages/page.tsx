export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import RemovePagesClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "PDF删除页面 - 免费在线删除PDF指定页面";
const description = "免费在线删除PDF中的指定页面，支持可视化选择或表达式输入，快速、安全、无需注册。";
const keywords = "PDF删除页面,删除PDF页面,PDF页面删除,在线PDF删除页面";
const path = "/remove-pages";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF删除页面工具",
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

export default function RemovePagesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RemovePagesClient />
    </>
  );
}
