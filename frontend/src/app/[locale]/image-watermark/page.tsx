import { Metadata } from "next";
import ImageWatermarkClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "图片加水印 - 在线图片文字水印工具";
const description = "免费在线图片加水印工具，支持文字水印、自定义位置、透明度调节、旋转角度设置，保护您的图片版权。";
const keywords = "图片水印,加水印,文字水印,图片版权保护,在线水印工具";
const path = "/image-watermark";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "图片加水印工具",
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

export default function ImageWatermarkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageWatermarkClient />
    </>
  );
}
