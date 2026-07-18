"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, FileText, Sparkles } from "lucide-react";
import { BlogPostMeta } from "@/lib/blog";

export default function BlogClientPage({ posts }: { posts: BlogPostMeta[] }) {
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="blog-studio min-h-screen">
      <section className="blog-index-hero">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:py-20">
          <div className="blog-index-masthead">
            <div>
              <div className="blog-eyebrow"><Sparkles className="h-4 w-4" /> PDF/LAB EDITORIAL</div>
              <h1 className="blog-index-title">文档处理<br /><span>灵感档案</span></h1>
            </div>
            <div className="blog-index-intro">
              <span className="blog-issue">ISSUE / {String(posts.length).padStart(2, "0")}</span>
              <p>关于 PDF、效率工具与数字工作的实用观察。拒绝复杂术语，只提供可以立即使用的方法。</p>
              <div className="blog-index-rule" />
              <span>持续更新 · 免费阅读</span>
            </div>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
          <div className="blog-empty">
            <FileText className="h-12 w-12" />
            <h2>新一期正在排版</h2>
            <p>高质量的 PDF 转换教程即将发布。</p>
          </div>
        </section>
      ) : (
        <>
          {featuredPost && (
            <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:pb-24">
              <Link href={`/blog/${featuredPost.slug}`} className="blog-feature group">
                <div className="blog-feature-media">
                  {featuredPost.coverImage ? (
                    <img src={featuredPost.coverImage} alt={featuredPost.title} />
                  ) : (
                    <div className="blog-cover-placeholder">PDF<br />LAB</div>
                  )}
                  <span className="blog-feature-label">本期封面 / FEATURED</span>
                </div>
                <div className="blog-feature-copy">
                  <div className="blog-card-meta">
                    <span>{featuredPost.formattedDate}</span>
                    <span><Clock3 className="h-4 w-4" /> {featuredPost.readingTime} MIN</span>
                  </div>
                  <div className="blog-tag-row">
                    {featuredPost.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.excerpt}</p>
                  <div className="blog-read-link">打开文章 <ArrowUpRight className="h-5 w-5" /></div>
                </div>
              </Link>
            </section>
          )}

          {remainingPosts.length > 0 && (
            <section className="blog-archive-section">
              <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-24">
                <div className="blog-section-heading">
                  <span>ARCHIVE / 文章索引</span>
                  <span>{remainingPosts.length} STORIES</span>
                </div>
                <div className="blog-archive-grid">
                  {remainingPosts.map((post, index) => (
                    <article key={post.slug} className="blog-archive-card group">
                      <Link href={`/blog/${post.slug}`}>
                        <div className="blog-card-number">{String(index + 2).padStart(2, "0")}</div>
                        <div className="blog-card-media">
                          {post.coverImage ? <img src={post.coverImage} alt={post.title} /> : <FileText className="h-12 w-12" />}
                          <span><Clock3 className="h-3.5 w-3.5" /> {post.readingTime} MIN</span>
                        </div>
                        <div className="blog-card-body">
                          <div className="blog-tag-row">{post.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
                          <h2>{post.title}</h2>
                          <p>{post.excerpt}</p>
                          <div className="blog-card-footer"><span>{post.formattedDate}</span><ArrowUpRight className="h-5 w-5" /></div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        <div className="studio-cta blog-cta">
          <span className="blog-cta-label">FROM READING TO MAKING</span>
          <h2>读完了？<br />现在处理你的文档。</h2>
          <p>快速、安全地完成 PDF 与 Word 之间的转换，无需安装任何软件。</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/word-to-pdf" className="studio-cta-button">Word 转 PDF <ArrowUpRight className="h-5 w-5" /></Link>
            <Link href="/pdf-to-word" className="blog-cta-secondary">PDF 转 Word</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
