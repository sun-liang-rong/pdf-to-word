export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import RearrangePdfClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "PDF页面排序 - 免费在线PDF重新排列工具";
const description = "免费在线PDF页面排序工具，支持拖拽排序、自动排列模式。可视化调整PDF页面顺序，快速生成新的PDF文件。";
const keywords = "PDF排序,PDF页面排序,PDF重新排列,在线PDF排序,PDF页面调整";
const path = "/rearrange-pdf";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF页面排序工具",
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

export default function RearrangePdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RearrangePdfClient />
    </>
  );
}
