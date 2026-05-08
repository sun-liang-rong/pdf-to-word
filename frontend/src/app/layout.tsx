import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Converter - Free Online PDF Tools",
  description: "Free online PDF conversion tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="light" suppressHydrationWarning>
      <head>
        {/* 主题防闪烁脚本 — 在首帧绘制前同步执行，优先亮色主题 */}
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
                  // 拦截 next-themes 的 classList.remove，防止闪烁
                  var obs = new MutationObserver(function() {
                    if (!root.classList.contains(target)) {
                      root.classList.remove('light', 'dark');
                      root.classList.add(target);
                    }
                  });
                  obs.observe(root, { attributes: true, attributeFilter: ['class'] });
                  // React hydrate 完成后停止监听
                  setTimeout(function() { obs.disconnect(); }, 2000);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
