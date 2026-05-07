import { Metadata } from "next";
import ImageCompressClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "图片压缩在线工具 - 免费图片压缩";
const description = "免费在线图片压缩工具，支持JPG、PNG、WebP格式压缩，可调整压缩质量，保持最佳画质。";
const keywords = "图片压缩,在线图片压缩,JPG压缩,PNG压缩,WebP压缩,免费图片压缩";
const path = "/image-compress";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "图片压缩工具",
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

export default function ImageCompressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressClient />
    </>
  );
}
