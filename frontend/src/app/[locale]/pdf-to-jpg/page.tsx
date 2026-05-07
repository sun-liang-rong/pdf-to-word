import { Metadata } from "next";
import PdfToJpgClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "PDF转JPG在线转换 - 免费PDF转图片工具";
const description = "免费在线PDF转JPG转换器，将PDF文件的每一页转换为高清JPG图片，支持批量下载。";
const keywords = "PDF转JPG,PDF to JPG,PDF转图片,在线PDF转JPG,免费PDF转图片";
const path = "/pdf-to-jpg";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF转JPG在线转换器",
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

export default function PdfToJpgPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfToJpgClient />
    </>
  );
}
