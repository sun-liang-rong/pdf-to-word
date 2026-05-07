import { Metadata } from "next";
import JpgToPdfClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "JPG转PDF在线转换 - 免费图片转PDF工具";
const description = "免费在线JPG转PDF转换器，将JPG、PNG图片转换为PDF文件，支持多图合并，保持高清画质。";
const keywords = "JPG转PDF,JPG to PDF,图片转PDF,在线JPG转PDF,免费图片转PDF";
const path = "/jpg-to-pdf";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JPG转PDF在线转换器",
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

export default function JpgToPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JpgToPdfClient />
    </>
  );
}
