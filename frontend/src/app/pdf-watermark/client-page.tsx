"use client";

import { useState } from "react";
import { Stamp } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";
import WatermarkControls from "@/components/pdf-tools/WatermarkControls";

export default function PdfWatermarkClient() {
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(32);
  const [rotation, setRotation] = useState(-45);
  const [opacity, setOpacity] = useState(0.3);
  const [spacing, setSpacing] = useState(80);
  const [color, setColor] = useState("#8b5cf6");
  return (
    <PdfOperationShell title="PDF 文字水印" description="自定义文字、颜色、角度和透明度，为整个 PDF 添加专业水印。" icon={<Stamp className="w-8 h-8" />} gradient="bg-gradient-to-r from-purple-500 to-fuchsia-500" endpoint="watermark/text" outputSuffix="-watermarked.pdf" fields={{ text, fontSize, rotation, opacity, spacing, customColor: color }} canSubmit={text.trim().length > 0} validationMessage={!text.trim() ? "请输入水印文字" : undefined}>
      <WatermarkControls text={text} setText={setText} fontSize={fontSize} setFontSize={setFontSize} rotation={rotation} setRotation={setRotation} opacity={opacity} setOpacity={setOpacity} spacing={spacing} setSpacing={setSpacing} color={color} setColor={setColor} />
    </PdfOperationShell>
  );
}
