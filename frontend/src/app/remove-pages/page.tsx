import { Metadata } from "next";
import RemovePagesClient from "./client-page";

export const metadata: Metadata = {
  title: "PDF删除页面 - 免费在线删除PDF指定页面",
  description: "免费在线删除PDF中的指定页面，支持可视化选择或表达式输入，快速、安全、无需注册。",
};

export default function RemovePagesPage() {
  return <RemovePagesClient />;
}
