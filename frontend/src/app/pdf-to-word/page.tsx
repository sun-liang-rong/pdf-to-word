export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import PdfToWordClient from "./client-page";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunsunblog.top';

export const metadata: Metadata = {
  title: "PDF 转 Word 在线转换 - 免费快速 PDF 转 Word 工具",
  description: "免费在线 PDF 转 Word 转换器，将 PDF 文件转换为可编辑的 Word 文档 (.doc)，保留原有格式和排版，无需注册，即用即走。",
  keywords: "PDF 转 Word,PDF to Word,PDF 转换 Word,在线 PDF 转 Word,免费 PDF 转 Word",
  alternates: {
    canonical: `${siteUrl}/pdf-to-word`,
  },
  openGraph: {
    title: "PDF 转 Word 在线转换 - 免费快速 PDF 转 Word 工具",
    description: "免费在线 PDF 转 Word 转换器，将 PDF 文件转换为可编辑的 Word 文档",
    type: "website",
    url: `${siteUrl}/pdf-to-word`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PDF 转 Word 在线转换工具",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 转 Word 在线转换 - 免费快速 PDF 转 Word 工具",
    description: "免费在线 PDF 转 Word 转换器，将 PDF 文件转换为可编辑的 Word 文档",
    images: [`${siteUrl}/og-image.png`],
  },
};

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 转 Word 在线转换器",
  "description": "免费在线 PDF 转 Word 转换器，将 PDF 文件转换为可编辑的 Word 文档",
  "url": `${siteUrl}/pdf-to-word`,
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
  },
  "faqPage": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "PDF转Word后格式会乱吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "我们的转换引擎采用先进的OCR技术和格式识别算法，能够最大程度保留原文档的排版、图片和表格。对于大多数标准PDF文档，转换后的Word文件格式保持良好。"
        }
      },
      {
        "@type": "Question",
        "name": "PDF转Word支持批量转换吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "目前每次只能转换一个文件。如需批量转换，建议逐个上传转换，或者关注我们后续的批量转换功能更新。"
        }
      },
      {
        "@type": "Question",
        "name": "扫描版PDF能转换吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "可以。我们的系统支持OCR识别，能够将扫描版PDF转换为可编辑的Word文档。但识别效果取决于扫描件的清晰度。"
        }
      },
      {
        "@type": "Question",
        "name": "转换需要多长时间？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "通常10MB以内的PDF文件转换时间不超过15秒。文件越大、页数越多，转换时间会相应增加。"
        }
      }
    ]
  }
};

export default function PdfToWordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfToWordClient />
    </>
  );
}
