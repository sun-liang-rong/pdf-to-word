'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        // 用户取消分享，不做处理
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
      title={copied ? '已复制' : '分享'}
    >
      {copied ? '✅' : '🔗'}
    </button>
  );
}
