"use client";

import { useState } from "react";
import { ListOrdered } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";

export default function Client() {
  const [text, setText] = useState("第 {n} 页");
  const [position, setPosition] = useState(8);
  const [fontSize, setFontSize] = useState(12);
  const [pages, setPages] = useState("all");
  const inputClass = "mt-2 w-full rounded-xl border border-theme bg-theme-secondary p-3 text-theme";
  return (
    <PdfOperationShell title="添加页码与页眉页脚" description="使用自定义文字模板，在页面九宫格位置添加页码、页眉或页脚。" icon={<ListOrdered className="h-8 w-8" />} gradient="" endpoint="add-page-numbers" outputSuffix="-numbered.pdf" fields={{ customText: text, position, fontSize, pageNumbers: "all", pagesToNumber: pages, customMargin: "medium", fontType: "helvetica", fontColor: "#000000", zeroPad: 0, startingNumber: 1 }}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-theme">文字模板<input value={text} onChange={(event) => setText(event.target.value)} placeholder="第 {n} 页" className={inputClass} /></label>
        <label className="text-sm text-theme">位置<select value={position} onChange={(event) => setPosition(Number(event.target.value))} className={inputClass}><option value={2}>顶部居中</option><option value={8}>底部居中</option><option value={7}>底部左侧</option><option value={9}>底部右侧</option></select></label>
        <label className="text-sm text-theme">字号<input type="number" min={6} max={72} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className={inputClass} /></label>
        <label className="text-sm text-theme">页码范围<input value={pages} onChange={(event) => setPages(event.target.value)} className={inputClass} /></label>
      </div>
    </PdfOperationShell>
  );
}
