import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogClientPage from './client-page';

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

  return <BlogClientPage posts={posts} />;
}
