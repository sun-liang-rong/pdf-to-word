"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";

export default function RotatePdfClient() {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  return (
    <PdfOperationShell title="旋转 PDF" description="一次旋转整个 PDF 文档，快速修正倒置或横向页面。" icon={<RotateCw className="w-8 h-8" />} gradient="bg-gradient-to-r from-indigo-500 to-violet-500" endpoint="rotate" outputSuffix="-rotated.pdf" fields={{ angle }}>
      <div>
        <label className="block text-sm font-semibold text-theme mb-3">旋转角度</label>
        <div className="grid grid-cols-3 gap-3">
          {[90, 180, 270].map((value) => <button key={value} onClick={() => setAngle(value as 90 | 180 | 270)} className={`py-4 rounded-2xl border font-semibold transition ${angle === value ? "border-indigo-500 bg-indigo-500/10 text-indigo-500" : "border-theme text-theme-muted hover:bg-theme-secondary"}`}>{value}°</button>)}
        </div>
      </div>
    </PdfOperationShell>
  );
}
