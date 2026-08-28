import Link from "next/link";
import { ArrowRight, FileQuestion, House, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="void-page not-found-page min-h-screen">
      <div className="void-grid" aria-hidden="true" />
      <main className="not-found-shell">
        <div className="not-found-code">ERROR / 404</div>
        <div className="not-found-layout">
          <div>
            <div className="not-found-icon"><FileQuestion className="h-8 w-8" /></div>
            <h1>页面未找到</h1>
            <p>您访问的页面不存在或已被移除。回到工作台，继续处理文档。</p>
            <div className="not-found-actions">
              <Link href="/" className="not-found-primary"><House className="h-4 w-4" />返回首页</Link>
              <Link href="/pdf-to-word" className="not-found-secondary"><ArrowRight className="h-4 w-4" />开始转换</Link>
            </div>
          </div>
          <div className="not-found-index" aria-hidden="true">
            <Search className="h-7 w-7" />
            <strong>404</strong>
            <span>NO DOCUMENT / NO ROUTE</span>
          </div>
        </div>
        <div className="not-found-links">
          <span>QUICK ACCESS</span>
          <Link href="/pdf-to-word">PDF 转 Word</Link>
          <Link href="/word-to-pdf">Word 转 PDF</Link>
          <Link href="/pdf-to-jpg">PDF 转 JPG</Link>
          <Link href="/merge-pdf">合并 PDF</Link>
          <Link href="/compress-pdf">压缩 PDF</Link>
        </div>
      </main>
    </div>
  );
}
