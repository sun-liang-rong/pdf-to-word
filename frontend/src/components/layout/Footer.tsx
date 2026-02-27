import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: "/pdf-to-word", label: "PDF转Word" },
    { href: "/word-to-pdf", label: "Word转PDF" },
    { href: "/pdf-to-jpg", label: "PDF转JPG" },
    { href: "/jpg-to-pdf", label: "JPG转PDF" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📄</span>
              <span className="text-xl font-bold text-white">PDF转换器</span>
            </div>
            <p className="text-gray-400 mb-4">
              免费在线PDF转换工具，支持PDF与Word、图片等多种格式互转。
              快速、安全、无需注册。
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">转换工具</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">关于我们</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  使用条款
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} PDF转换器. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}
