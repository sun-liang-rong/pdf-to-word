import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "../providers";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { siteUrl } from "@/lib/seo-config";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: siteUrl,
      languages: {
        'zh': `${siteUrl}/zh`,
        'en': `${siteUrl}/en`,
      },
    },
    manifest: "/manifest.json",
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: siteUrl,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${siteUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="light" suppressHydrationWarning>
      <head>
        {/* 主题防闪烁脚本 — 与根布局保持一致 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var root = document.documentElement;
                  var target = theme === 'dark' ? 'dark' : 'light';
                  root.classList.remove('light', 'dark');
                  root.classList.add(target);
                  var obs = new MutationObserver(function() {
                    if (!root.classList.contains(target)) {
                      root.classList.remove('light', 'dark');
                      root.classList.add(target);
                    }
                  });
                  obs.observe(root, { attributes: true, attributeFilter: ['class'] });
                  setTimeout(function() { obs.disconnect(); }, 2000);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
