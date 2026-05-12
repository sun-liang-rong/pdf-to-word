import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 博客文章类型
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  author: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  content: string;
  excerpt: string;
}

// 博客文章元数据（用于列表）
export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  author: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  excerpt: string;
}

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

// 计算阅读时间
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 300; // 中文阅读速度
  const words = content.replace(/\s/g, '').length;
  return Math.ceil(words / wordsPerMinute);
}

// 生成摘要
function generateExcerpt(content: string, maxLength: number = 150): string {
  // 移除 Markdown 标记
  const plainText = content
    .replace(/#+ /g, '')
    .replace(/\[([^\\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\n/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength) + '...';
}

// 获取所有博客文章
export function getAllPosts(): BlogPostMeta[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Ensure tags is always an array of strings
      let tags = [];
      if (Array.isArray(data.tags)) {
        tags = data.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '');
      } else if (typeof data.tags === 'string') {
        tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }

      return {
        slug,
        title: data.title || '无标题',
        description: data.description || '',
        date: typeof data.date === 'string' ? data.date : new Date().toISOString(),
        formattedDate: format(parseISO(typeof data.date === 'string' ? data.date : new Date().toISOString()), 'yyyy年MM月dd日', { locale: zhCN }),
        author: data.author || 'PDF转换器团队',
        tags,
        coverImage: data.coverImage,
        readingTime: calculateReadingTime(content),
        excerpt: generateExcerpt(content),
      };
    })
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));

  return allPostsData;
}

// 获取单篇博客文章
export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);

  let filePath = '';
  if (fs.existsSync(fullPath)) {
    filePath = fullPath;
  } else if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Ensure tags is always an array of strings
  let tags = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '');
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }

  return {
    slug,
    title: data.title || '无标题',
    description: data.description || '',
    date: typeof data.date === 'string' ? data.date : new Date().toISOString(),
    formattedDate: format(parseISO(typeof data.date === 'string' ? data.date : new Date().toISOString()), 'yyyy年MM月dd日', { locale: zhCN }),
    author: data.author || 'PDF转换器团队',
    tags,
    coverImage: data.coverImage,
    readingTime: calculateReadingTime(content),
    content,
    excerpt: generateExcerpt(content),
  };
}

// 获取相关文章
export function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): BlogPostMeta[] {
  const allPosts = getAllPosts().filter(post => post.slug !== currentSlug);

  // 根据标签匹配度排序
  const scoredPosts = allPosts.map(post => {
    const postTags = Array.isArray(post.tags) ? post.tags : [];
    const matchingTags = postTags.filter(tag => tags.includes(tag));
    return { ...post, score: matchingTags.length };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// 获取所有标签
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
}

// 按标签获取文章
export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}