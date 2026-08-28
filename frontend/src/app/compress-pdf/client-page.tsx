"use client";

import { useState } from "react";
import { Minimize2 } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";
import CompressOptions from "@/components/compress/CompressOptions";
import { useI18n } from "@/lib/i18n";

export default function CompressPdfClient() {
  const { t } = useI18n();
  const [optimizeLevel, setOptimizeLevel] = useState(2);
  const [expectedOutputSize, setExpectedOutputSize] = useState("");
  const [linearize, setLinearize] = useState(false);
  const [normalize, setNormalize] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [lineArt, setLineArt] = useState(false);
  const [lineArtThreshold, setLineArtThreshold] = useState(50);
  const [lineArtEdgeLevel, setLineArtEdgeLevel] = useState(2);

  return (
    <PdfOperationShell
      title={t("tools_detail.compressPdf.title")}
      description={t("tools_detail.compressPdf.description")}
      icon={<Minimize2 className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-pink-500 to-rose-500"
      endpoint="compress"
      outputSuffix=".pdf"
      fields={{ optimizeLevel, expectedOutputSize, linearize: String(linearize), normalize: String(normalize), grayscale: String(grayscale), lineArt: String(lineArt), lineArtThreshold, lineArtEdgeLevel }}
    >
      <CompressOptions
        optimizeLevel={optimizeLevel}
        expectedOutputSize={expectedOutputSize}
        linearize={linearize}
        normalize={normalize}
        grayscale={grayscale}
        lineArt={lineArt}
        lineArtThreshold={lineArtThreshold}
        lineArtEdgeLevel={lineArtEdgeLevel}
        onOptimizeLevelChange={setOptimizeLevel}
        onExpectedOutputSizeChange={setExpectedOutputSize}
        onLinearizeChange={setLinearize}
        onNormalizeChange={setNormalize}
        onGrayscaleChange={setGrayscale}
        onLineArtChange={setLineArt}
        onLineArtThresholdChange={setLineArtThreshold}
        onLineArtEdgeLevelChange={setLineArtEdgeLevel}
      />
    </PdfOperationShell>
  );
}
