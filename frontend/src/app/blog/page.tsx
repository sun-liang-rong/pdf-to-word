import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'PDF转换教程与指南 - 免费在线PDF转换器博客',
  description: '学习PDF转换技巧、Word转PDF教程、PDF压缩方法等实用指南。免费在线PDF转换器提供专业的文档处理知识。',
  keywords: 'PDF教程,PDF转换指南,Word转PDF教程,PDF压缩方法,PDF使用技巧',
  alternates: {
    canonical: 'https://sunsunblog.top/blog',
  },
  openGraph: {
    title: 'PDF转换教程与指南 - 免费在线PDF转换器博客',
    description: '学习PDF转换技巧、Word转PDF教程、PDF压缩方法等实用指南',
    type: 'website',
    url: 'https://sunsunblog.top/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent-cyan/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-300 via-primary-500 to-accent-cyan bg-clip-text text-transparent">
              PDF 转换指南
            </h1>
            <p className="text-xl text-foreground-muted mb-8">
              学习 PDF 处理技巧、格式转换教程和文档优化方法
            </p>
            
            {/* 标签云 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-primary/10 dark:text-primary-300 text-primary-700 rounded-full text-sm hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 博客列表 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2">博客文章即将上线</h2>
              <p className="text-foreground-muted">
                我们正在准备高质量的 PDF 转换教程，敬请期待！
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-card rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow"
                >
                  <Link href={`/blog/${post.slug}`}>
                    {/* 封面图 */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent-cyan/20 relative overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                          📄
                        </div>
                      )}
                      {/* 阅读时间标签 */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white shadow-lg">
                        {post.readingTime} 分钟阅读
                      </div>
                    </div>

                    {/* 内容 */}
                    <div className="p-6">
                      {/* 标签 */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary/10 dark:text-primary-300 text-primary-700 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 标题 */}
                      <h2 className="text-xl font-bold mb-3 group-hover:text-primary-300 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* 描述 */}
                      <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* 元信息 */}
                      <div className="flex items-center justify-between text-xs text-foreground-muted">
                        <span>{post.author}</span>
                        <span>{post.formattedDate}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-primary/10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent-cyan/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">准备好转换您的文档了吗？</h2>
            <p className="text-foreground-muted mb-8 max-w-2xl mx-auto">
              使用我们的免费在线工具，快速、安全地完成 PDF 与 Word 之间的转换
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/word-to-pdf"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-primary hover:shadow-primary-lg"
              >
                Word 转 PDF
              </Link>
              <Link
                href="/pdf-to-word"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-foreground rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-primary/20"
              >
                PDF 转 Word
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
