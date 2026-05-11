"use client";

import Link from "next/link";
import { Shield, Clock, Lock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center text-white text-sm">
              📄
            </div>
            <span className="text-sm font-semibold text-gray-800">PDF转换器</span>
            <span className="text-xs text-gray-400">© {currentYear} 保留所有权利</span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-primary-500 transition-colors">隐私政策</Link>
            <Link href="/terms" className="hover:text-primary-500 transition-colors">使用条款</Link>
            <Link href="/about" className="hover:text-primary-500 transition-colors">关于我们</Link>
          </div>

          {/* Right: Badges */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              SSL加密
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              30分钟自动删除
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              安全可靠
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
