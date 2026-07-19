"use client";

import { useState } from "react";
import { Scaling } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";

export default function Client() {
  const [size, setSize] = useState("A4");
  const [factor, setFactor] = useState(0.9);
  return (
    <PdfOperationShell title="调整 PDF 页面尺寸" description="缩放页面内容并统一为 A4、Letter、Legal 等标准纸张尺寸。" icon={<Scaling className="h-8 w-8" />} gradient="" endpoint="scale-pdf" outputSuffix="-scaled.pdf" fields={{ pageSize: size, scaleFactor: factor }}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-theme">页面尺寸
          <select value={size} onChange={(event) => setSize(event.target.value)} className="mt-2 w-full rounded-xl border border-theme bg-theme-secondary p-3 text-theme">
            {['A4', 'A3', 'A5', 'LETTER', 'LEGAL', 'KEEP'].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-sm text-theme">内容缩放比例：{factor}
          <input type="range" min="0.1" max="2" step="0.05" value={factor} onChange={(event) => setFactor(Number(event.target.value))} className="mt-4 w-full" />
        </label>
      </div>
    </PdfOperationShell>
  );
}
