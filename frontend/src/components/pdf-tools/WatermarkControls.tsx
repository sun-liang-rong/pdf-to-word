"use client";

interface WatermarkControlsProps {
  text: string; setText: (value: string) => void;
  fontSize: number; setFontSize: (value: number) => void;
  rotation: number; setRotation: (value: number) => void;
  opacity: number; setOpacity: (value: number) => void;
  spacing: number; setSpacing: (value: number) => void;
  color: string; setColor: (value: string) => void;
}

export default function WatermarkControls(props: WatermarkControlsProps) {
  const sliders = [
    ["字体大小", props.fontSize, props.setFontSize, 8, 120, 1],
    ["旋转角度", props.rotation, props.setRotation, -180, 180, 1],
    ["透明度", props.opacity, props.setOpacity, 0.05, 1, 0.05],
    ["间距", props.spacing, props.setSpacing, 0, 300, 5],
  ] as const;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-theme mb-2">水印文字</label><input value={props.text} maxLength={200} onChange={(e) => props.setText(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-theme-secondary border border-theme text-theme outline-none focus:border-purple-500" /></div>
      <div className="grid md:grid-cols-2 gap-5">
        {sliders.map(([label, value, setter, min, max, step]) => <label key={label} className="text-sm text-theme"><span className="flex justify-between mb-2"><b>{label}</b><span className="text-theme-muted">{value}</span></span><input type="range" value={value} min={min} max={max} step={step} onChange={(e) => setter(Number(e.target.value))} className="w-full accent-purple-500" /></label>)}
      </div>
      <label className="flex items-center justify-between p-3 rounded-xl bg-theme-secondary border border-theme text-sm font-semibold text-theme">水印颜色<input type="color" value={props.color} onChange={(e) => props.setColor(e.target.value)} className="h-9 w-14 rounded cursor-pointer" /></label>
      <div className="relative h-44 rounded-2xl overflow-hidden border border-theme bg-white">
        <div className="absolute inset-0 grid place-items-center text-gray-300 text-sm">PDF 页面预览</div>
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-10 overflow-hidden p-4" style={{ color: props.color, opacity: props.opacity, fontSize: Math.min(props.fontSize, 48), transform: `rotate(${props.rotation}deg)` }}>{Array.from({ length: 8 }, (_, i) => <span key={i} className="whitespace-nowrap font-bold">{props.text || "WATERMARK"}</span>)}</div>
      </div>
    </div>
  );
}
