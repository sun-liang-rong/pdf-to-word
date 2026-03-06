import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF转换器 - 免费在线PDF转Word、Word转PDF工具",
  description: "免费在线PDF转换工具，支持PDF转Word、Word转PDF、PDF转JPG、JPG转PDF等多种格式转换，快速、安全、无需注册。",
  keywords: "PDF转换器,PDF转Word,Word转PDF,在线PDF转换,免费PDF转换",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
