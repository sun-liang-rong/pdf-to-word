# Next.js 主题切换功能实现计划

## 一、需求概述

使用 `next-themes` 库在 Next.js 项目中实现亮色/暗黑主题切换功能，支持：
- 亮色主题和暗黑主题切换
- 用户选择持久化存储
- 页面刷新无闪烁
- SSR 兼容

## 二、技术方案

### 技术选型
- **next-themes**: 主题管理库，专门为 Next.js 设计
- **CSS Variables**: 主题变量控制
- **localStorage**: 主题持久化存储

### 方案优势
1. `next-themes` 内置 SSR 支持，避免 hydration 错误
2. 自动处理主题持久化
3. 内置防止闪烁机制
4. 简单易用的 API

## 三、实现步骤

### 步骤 1：安装 next-themes 依赖

```bash
npm install next-themes
# 或
yarn add next-themes
# 或
pnpm add next-themes
```

### 步骤 2：创建 ThemeProvider 组件

创建文件：`src/components/theme/ThemeProvider.tsx`

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 步骤 3：创建主题切换组件

创建文件：`src/components/theme/ThemeToggle.tsx`

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // 防止 hydration 不匹配
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      aria-label="切换主题"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
```

### 步骤 4：修改 layout.tsx 集成 ThemeProvider

修改文件：`src/app/layout.tsx`

```tsx
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 步骤 5：配置 CSS 变量

修改文件：`src/app/globals.css`

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  /* 其他亮色变量 */
}

.dark {
  --background: #0a0a0a;
  --foreground: #ffffff;
  /* 其他暗色变量 */
}
```

### 步骤 6：删除旧的 ThemeContext

删除文件：
- `src/contexts/ThemeContext.tsx`
- `src/components/theme/ThemeScript.tsx`

### 步骤 7：更新 Header 组件

修改文件：`src/components/layout/Header.tsx`

替换原有的主题切换逻辑，使用 `ThemeToggle` 组件。

### 步骤 8：清理 layout.tsx 中的内联样式

移除之前添加的防闪烁内联样式，`next-themes` 会自动处理。

## 四、文件变更清单

### 新增文件
| 文件路径 | 说明 |
|---------|------|
| `src/components/theme/ThemeProvider.tsx` | 主题 Provider 组件 |
| `src/components/theme/ThemeToggle.tsx` | 主题切换按钮组件 |

### 修改文件
| 文件路径 | 说明 |
|---------|------|
| `src/app/layout.tsx` | 集成 ThemeProvider |
| `src/app/globals.css` | 配置 CSS 变量 |
| `src/components/layout/Header.tsx` | 使用新的主题切换组件 |
| `src/app/providers.tsx` | 移除旧的 ThemeProvider |

### 删除文件
| 文件路径 | 说明 |
|---------|------|
| `src/contexts/ThemeContext.tsx` | 旧的主题上下文 |
| `src/components/theme/ThemeScript.tsx` | 旧的防闪烁脚本 |

## 五、关键配置说明

### ThemeProvider 配置参数

| 参数 | 值 | 说明 |
|-----|-----|------|
| `attribute` | `"class"` | 使用 class 控制主题 |
| `defaultTheme` | `"dark"` | 默认暗色主题 |
| `enableSystem` | `false` | 不跟随系统主题 |
| `disableTransitionOnChange` | `true` | 切换时禁用动画 |

### 主题值

- 亮色主题：`"light"`
- 暗黑主题：`"dark"`

### localStorage 存储

- Key: `theme`
- Value: `"light"` | `"dark"`

## 六、防止闪烁机制

`next-themes` 内置防闪烁机制：

1. 自动在 `<head>` 中注入初始化脚本
2. 脚本在 HTML 解析时立即执行
3. 读取 localStorage 并设置主题 class
4. 使用 `suppressHydrationWarning` 避免 hydration 错误

## 七、测试验证

### 测试场景

1. **首次访问**: 显示默认主题（暗色）
2. **切换主题**: 点击按钮立即切换
3. **刷新页面**: 保持当前主题
4. **页面跳转**: 主题状态保持
5. **SSR 渲染**: 无 hydration 错误
6. **页面刷新**: 无主题闪烁

### 验证方法

```bash
# 开发环境测试
npm run dev

# 生产环境测试
npm run build && npm run start
```

## 八、注意事项

1. 所有使用主题的组件必须是客户端组件（"use client"）
2. 使用 `mounted` 状态避免 hydration 不匹配
3. CSS 变量命名保持一致
4. 不要在组件中直接使用 `localStorage`，使用 `next-themes` 提供的 API

## 九、后续扩展

未来可扩展功能：

1. **系统主题跟随**: 设置 `enableSystem={true}`
2. **多主题支持**: 添加更多主题选项
3. **主题切换动画**: 设置 `disableTransitionOnChange={false}`
