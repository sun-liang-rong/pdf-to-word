#!/bin/bash
# AI 新闻博客生成脚本
# 每天早上 9 点执行，获取 AI 热点新闻并生成两篇博客

set -e

# 配置
PROJECT_DIR="/usr/local/html/pdf-to-word"
FRONTEND_DIR="$PROJECT_DIR/frontend"
OUTPUT_DIR="$PROJECT_DIR/cron-output"
LOG_FILE="$OUTPUT_DIR/cron.log"
DATE=$(date +%Y-%m-%d)
DATETIME=$(date +%Y%m%d_%H%M%S)

# 记录开始
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

echo "=========================================="
echo "AI 新闻博客生成任务开始: $(date)"
echo "=========================================="

# 检查环境
cd "$FRONTEND_DIR"

# 调用 Hermes Agent 生成博客
# 使用 hermes 命令行工具发送消息给 Agent
/usr/local/bin/hermes --task "
请帮我完成以下任务：

## 任务：生成两篇 AI 圈热点新闻博客

### 步骤 1：获取 AI 热点新闻
请搜索今天最新的 AI 圈热点新闻，关注以下方面：
- OpenAI / GPT 相关动态
- Claude / Anthropic 更新
- Google / Gemini 发布
- 其他 AI 公司重要新闻
- AI 技术突破
- AI 应用场景创新

### 步骤 2：分析新闻价值
从搜索结果中选择 2 个最有价值的新闻：
1. 与文档处理、PDF、办公效率相关的新闻（优先）
2. 或者对普通用户有实际影响的 AI 新闻

### 步骤 3：撰写博客文章
在 $FRONTEND_DIR/src/content/blog/ 目录下创建两篇博客：

**文章 1 要求：**
- 文件名：ai-news-$(date +%Y%m%d)-1.md
- 标题：吸引人的标题，包含关键词
- 内容结构：
  - 新闻概述（发生了什么）
  - 详细解读（技术原理/背景）
  - 对 PDF/文档处理的影响（如果相关）
  - 用户应该关注什么
  - 未来展望
- 字数：1500-2500 字
- 标签：相关 AI 标签
- 封面图：使用 /blog/ai-news-gpt5.svg 或 /blog/ai-news-claude.svg 或 /blog/ai-pdf-processing.svg

**文章 2 要求：**
- 文件名：ai-news-$(date +%Y%m%d)-2.md
- 另一个不同主题的 AI 新闻
- 同样的内容结构要求
- 字数：1500-2500 字

### 步骤 4：Frontmatter 格式
每篇文章必须包含正确的 frontmatter：
\`\`\`
---
title: "文章标题"
description: "文章描述，150字以内"
date: "$(date +%Y-%m-%d)"
author: "PDF转换器团队"
tags: ["标签1", "标签2", "标签3"]
coverImage: "/blog/xxx.svg"
---
\`\`\`

### 步骤 5：内部链接
在文章中适当位置添加内部链接：
- 链接到 /blog/ai-pdf-processing
- 链接到 /blog/ai-news-gpt5 或 /blog/ai-news-claude
- 链接到工具页面 /word-to-pdf 或 /pdf-to-word

### 输出要求：
1. 创建两篇完整的博客文章
2. 确保 Markdown 格式正确
3. 返回创建的文件路径和文章标题
" --output "$OUTPUT_DIR/agent-response-$DATETIME.txt"

# 检查结果
if [ $? -eq 0 ]; then
    echo "✅ Agent 任务执行成功"
    
    # 检查是否生成了新文件
    NEW_FILES=$(find "$FRONTEND_DIR/src/content/blog" -name "ai-news-*.md" -newer "$LOG_FILE" 2>/dev/null | head -2)
    
    if [ -n "$NEW_FILES" ]; then
        echo "✅ 发现新博客文件:"
        echo "$NEW_FILES"
        
        # 重新构建项目
        echo "开始重新构建 Next.js 项目..."
        cd "$FRONTEND_DIR"
        
        if npm run build >> "$LOG_FILE" 2>&1; then
            echo "✅ 构建成功"
            
            # 重启前端服务
            pm2 restart pdf-to-word-frontend >> "$LOG_FILE" 2>&1
            echo "✅ 前端服务已重启"
            
            # 发送成功通知
            echo "✅ 博客生成任务完成: $(date)"
            echo "新文章:"
            echo "$NEW_FILES" | while read file; do
                echo "  - $(basename $file)"
            done
        else
            echo "❌ 构建失败，请检查日志"
            exit 1
        fi
    else
        echo "⚠️ 未发现新博客文件，可能 Agent 未生成"
        exit 1
    fi
else
    echo "❌ Agent 任务执行失败"
    exit 1
fi

echo "=========================================="
echo "任务结束: $(date)"
echo "=========================================="
