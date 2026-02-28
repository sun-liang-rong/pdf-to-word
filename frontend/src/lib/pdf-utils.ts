import * as pdfjs from "pdfjs-dist";

// 设置 PDF.js worker 使用本地文件
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

/**
 * 获取 PDF 文件的总页数
 * @param file PDF 文件对象
 * @returns PDF 文件的总页数
 */
export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    return pdf.numPages;
  } catch (error) {
    console.error("获取 PDF 页数失败:", error);
    throw new Error("无法读取 PDF 文件");
  }
}
