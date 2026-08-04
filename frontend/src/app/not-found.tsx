import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 数字 */}
        <div className="mb-8">
          <span className="text-8xl font-bold text-primary-500">404</span>
        </div>
        
        {/* 图标 */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl flex items-center justify-center mx-auto border border-primary/30">
            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        {/* 标题 */}
        <h1 className="text-2xl font-bold text-white mb-4">页面未找到</h1>
        
        {/* 描述 */}
        <p className="text-foreground-muted mb-8">
          您访问的页面不存在或已被移除。请返回首页继续使用我们的 PDF 转换工具。
        </p>
        
        {/* 按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
          
          <Link
            href="/pdf-to-word"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/5 border border-primary/30 text-white font-medium rounded-xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            开始转换
          </Link>
        </div>
        
        {/* 常用链接 */}
        <div className="mt-12 pt-8 border-t border-primary/20">
          <h2 className="text-sm font-medium text-white mb-4">常用工具</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/pdf-to-word" className="text-xs text-foreground-muted hover:text-primary-400 transition-colors">
              PDF转Word
            </Link>
            <span className="text-foreground-muted/50">•</span>
            <Link href="/word-to-pdf" className="text-xs text-foreground-muted hover:text-primary-400 transition-colors">
              Word转PDF
            </Link>
            <span className="text-foreground-muted/50">•</span>
            <Link href="/pdf-to-jpg" className="text-xs text-foreground-muted hover:text-primary-400 transition-colors">
              PDF转JPG
            </Link>
            <span className="text-foreground-muted/50">•</span>
            <Link href="/merge-pdf" className="text-xs text-foreground-muted hover:text-primary-400 transition-colors">
              PDF合并
            </Link>
            <span className="text-foreground-muted/50">•</span>
            <Link href="/compress-pdf" className="text-xs text-foreground-muted hover:text-primary-400 transition-colors">
              PDF压缩
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}