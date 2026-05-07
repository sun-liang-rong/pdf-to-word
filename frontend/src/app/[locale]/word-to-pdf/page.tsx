import { Metadata } from "next";
import WordToPdfClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "Word转PDF在线转换 - 免费快速Word转PDF工具";
const description = "免费在线Word转PDF转换器，将Word文档(.doc/.docx)转换为PDF格式，完美保留原有排版和格式，无需注册。";
const keywords = "Word转PDF,Word to PDF,Word转换PDF,在线Word转PDF,免费Word转PDF";
const path = "/word-to-pdf";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Word转PDF在线转换器",
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

export default function WordToPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WordToPdfClient />
    </>
  );
}
