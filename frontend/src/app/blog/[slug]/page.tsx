import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import { ShareButton } from '@/components/blog/ShareButton';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态参数
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  // Ensure tags is always an array for join operation
  const tagsArray = Array.isArray(post.tags) ? post.tags : [];

  return {
    title: `${post.title} - PDF转换器博客`,
    description: post.description,
    keywords: tagsArray.join(','),
    alternates: {
      canonical: `https://sunsunblog.top/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://sunsunblog.top/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

// 简单的 Markdown 渲染函数
function renderMarkdown(content: string): string {
  // 转换标题 — 使用语义化颜色，适配亮/暗色模式
  let html = content
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-foreground">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground border-b border-primary/20 pb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-primary">$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-4 mb-2 text-foreground">$1</h4>');

  // 转换粗体和斜体
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 转换链接
  html = html.replace(/\[([^\\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-400 hover:text-primary-300 underline underline-offset-2">$1</a>');

  // 转换代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-primary/10 text-foreground px-2 py-1 rounded text-sm font-mono">$1</code>');

  // 转换代码块
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.slice(3, -3).trim();
    return `<pre class="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl overflow-x-auto my-6 border border-primary/10"><code class="text-sm font-mono text-foreground">${code}</code></pre>`;
  });

  // 转换引用
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 my-6 italic text-foreground-muted bg-primary/5 py-3 pr-4 rounded-r-lg">$1</blockquote>');

  // 转换分隔线
  html = html.replace(/^---$/gm, '<hr class="my-8 border-primary/20" />');

  // 转换列表项（先标记）
  html = html.replace(/^- (.+)$/gm, '___LISTITEM___$1___ENDLISTITEM___');

  // 处理列表
  const listRegex = /(___LISTITEM___.+?___ENDLISTITEM___\n?)+/g;
  html = html.replace(listRegex, (match) => {
    const items = match
      .split('___ENDLISTITEM___')
      .filter(item => item.trim())
      .map(item => item.replace('___LISTITEM___', '').trim())
      .map(item => `<li class="mb-2">${item}</li>`)
      .join('');
    return `<ul class="mb-4 ml-6 list-disc text-foreground-muted">${items}</ul>`;
  });

  // 转换表格
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
    const headerHtml = headers.map((h: string) => `<th class="border border-primary/20 px-4 py-3 bg-primary/10 text-left font-semibold">${h}</th>`).join('');

    const rowLines = rows.trim().split('\n');
    const rowsHtml = rowLines.map((line: string) => {
      const cells = line.split('|').map((c: string) => c.trim()).filter(Boolean);
      return `<tr>${cells.map((c: string) => `<td class="border border-primary/20 px-4 py-3 text-foreground-muted">${c}</td>`).join('')}</tr>`;
    }).join('');

    return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-primary/20"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
  });

  // 转换段落
  const lines = html.split('\n');
  let result = '';
  let inParagraph = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 如果已经是 HTML 标签，直接添加
    if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('<li')) {
      if (inParagraph) {
        result += '</p>';
        inParagraph = false;
      }
      result += line + '\n';
    } else if (trimmedLine === '') {
      if (inParagraph) {
        result += '</p>';
        inParagraph = false;
      }
      result += '\n';
    } else {
      if (!inParagraph) {
        result += '<p class="mb-4 text-foreground-muted leading-relaxed">';
        inParagraph = true;
      }
      result += trimmedLine + ' ';
    }
  }

  if (inParagraph) {
    result += '</p>';
  }

  return result;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, Array.isArray(post.tags) ? post.tags : []);
  const renderedContent = renderMarkdown(post.content);

  return (
    <div className="blog-studio blog-article-page min-h-screen">
      {/* 面包屑导航 */}
      <div className="blog-article-breadcrumb">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
          <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-foreground-muted">
            <Link href="/" className="hover:text-primary-300 transition-colors">
              首页
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary-300 transition-colors">
              博客
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px] md:max-w-md">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="pb-20 pt-10 lg:pb-28 lg:pt-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="mx-auto max-w-[1120px]">
            {/* 文章头部 */}
            <header className="blog-article-header mb-12">
              {/* 标签 */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="blog-tag-row mb-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="blog-article-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 标题 */}
              <h1 className="blog-article-title mb-8 text-5xl font-black leading-[0.92] tracking-[-0.055em] text-foreground md:text-7xl lg:text-8xl">
                {post.title}
              </h1>

              {/* 元信息 */}
              <div className="blog-byline flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                <span className="flex items-center gap-2">
                  <span className="blog-author-mark">
                    {post.author.charAt(0)}
                  </span>
                  {post.author}
                </span>
                <span>·</span>
                <span>{post.formattedDate}</span>
                <span>·</span>
                <span>{post.readingTime} 分钟阅读</span>
              </div>
            </header>

            {/* 封面图 */}
            {post.coverImage && (
              <div className="blog-article-cover mb-12 aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 文章内容 */}
            <div 
              className="blog-article-content p-6 md:p-12 lg:p-16"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* 分享和标签 */}
            <div className="blog-article-actions mt-12 pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted">标签：</span>
                  {Array.isArray(post.tags) ? post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="blog-article-tag"
                    >
                      {tag}
                    </span>
                  )) : null}
                </div>
                
                {/* 分享按钮 */}
                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted">分享：</span>
                  <ShareButton title={post.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 相关文章 */}
      {relatedPosts.length > 0 && (
        <section className="blog-related-section py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <h2 className="mb-10 text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">相关文章</h2>
            <div className="blog-related-grid mx-auto grid max-w-6xl md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="blog-related-card group p-6"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-foreground-muted line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="mt-4 text-xs text-foreground-muted">
                    {relatedPost.readingTime} 分钟阅读
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="studio-cta blog-cta mx-auto max-w-5xl p-8 md:p-12">
            <h2 className="mb-4 text-4xl font-black tracking-[-0.05em] text-[#151515] md:text-6xl">需要转换文档？</h2>
            <p className="text-foreground-muted mb-8">
              使用我们的免费在线工具，快速完成 PDF 与 Word 之间的转换
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/word-to-pdf"
                className="studio-cta-button"
              >
                立即转换
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}