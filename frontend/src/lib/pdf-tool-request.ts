import axios from 'axios';

export async function submitPdfTool(
  endpoint: string,
  file: File,
  fields: Record<string, string | number>,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  Object.entries(fields).forEach(([key, value]) => formData.append(key, String(value)));

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/convert/${endpoint}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.taskId;
}

export function pdfToolError(error: any, fallback: string): string {
  const message = error?.response?.data?.message;
  return Array.isArray(message) ? message.join('；') : message || fallback;
}
