// components/pdf/PDFViewer.example.tsx
import React, { useState } from 'react';
import PDFViewer, { PDFSource } from './PDFViewer';

export default function PDFViewerExample() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfSource, setPdfSource] = useState<PDFSource | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      setPdfSource({ type: 'file', file });
    }
  };

  const handleUrlLoad = () => {
    const url = prompt('请输入PDF URL:');
    if (url) {
      setPdfSource({ type: 'url', url });
    }
  };

  const handleBase64Load = () => {
    const base64 = prompt('请输入Base64编码的PDF:');
    if (base64) {
      setPdfSource({ type: 'base64', data: base64 });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PDF Viewer 示例</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">加载方式:</h2>
        <div className="flex flex-wrap gap-3">
          <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
            上传文件
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
          
          <button 
            onClick={handleUrlLoad}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            加载URL
          </button>
          
          <button 
            onClick={handleBase64Load}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Base64
          </button>
        </div>
        
        {file && (
          <p className="mt-2 text-gray-600">
            已选择文件: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {pdfSource && (
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <PDFViewer 
            source={pdfSource}
            showToolbar={true}
            showNavigation={true}
            showZoom={true}
            showDownload={true}
            showPrint={true}
            showFullscreen={true}
            defaultScale={1}
            initialPage={1}
            className="h-[600px]"
          />
        </div>
      )}
    </div>
  );
}