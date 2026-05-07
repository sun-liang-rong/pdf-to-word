import { Metadata } from "next";
import SplitPdfClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "PDF页面拆分 - 免费在线PDF拆分工具";
const description = "免费在线PDF拆分工具，支持单页拆分、多页拆分、批量拆分。可视化选择页面，快速生成独立PDF文件。";
const keywords = "PDF拆分,PDF页面拆分,拆分PDF,在线PDF拆分,免费PDF拆分";
const path = "/split-pdf";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF拆分工具",
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

export default function SplitPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitPdfClient />
    </>
  );
}
