#!/bin/bash
# 手动执行 AI 博客生成任务
# 用于测试或立即执行

echo "=========================================="
echo "手动执行 AI 博客生成任务"
echo "=========================================="
echo ""

# 检查参数
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --now     立即执行一次博客生成"
    echo "  --status  查看定时任务状态"
    echo "  --logs    查看执行日志"
    echo "  --help    显示此帮助信息"
    echo ""
    exit 0
fi

if [ "$1" == "--status" ]; then
    echo "查看定时任务状态..."
    echo ""
    # 使用 hermes cronjob 工具查看状态
    hermes cronjob list
    exit 0
fi

if [ "$1" == "--logs" ]; then
    LOG_FILE="/usr/local/html/pdf-to-word/cron-output/ai-blog-generator.log"
    if [ -f "$LOG_FILE" ]; then
        echo "查看最近 50 行日志:"
        echo "=========================================="
        tail -50 "$LOG_FILE"
    else
        echo "日志文件不存在: $LOG_FILE"
    fi
    exit 0
fi

# 立即执行任务
if [ "$1" == "--now" ]; then
    echo "立即执行博客生成任务..."
    echo ""
    
    # 调用 hermes cronjob 立即执行
    hermes cronjob run 3239bc20c492
    
    echo ""
    echo "任务已提交，请查看日志了解执行结果"
    exit 0
fi

# 默认：显示菜单
echo "请选择操作:"
echo ""
echo "1) 立即执行一次博客生成 (--now)"
echo "2) 查看定时任务状态 (--status)"
echo "3) 查看执行日志 (--logs)"
echo "4) 显示帮助 (--help)"
echo ""
echo "或者使用参数直接执行:"
echo "  $0 --now"
echo "  $0 --status"
echo "  $0 --logs"
echo ""
