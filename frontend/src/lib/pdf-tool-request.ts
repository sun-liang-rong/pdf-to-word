import axios from 'axios';

export interface ApiError {
  statusCode?: number;
  code?: string;
  message: string;
  retryable?: boolean;
  requestId?: string;
}

type ErrorPayload = {
  statusCode?: unknown;
  code?: unknown;
  message?: unknown;
  retryable?: unknown;
  requestId?: unknown;
  error?: unknown;
};

export async function submitPdfTool(
  endpoint: string,
  file: File,
  fields: Record<string, string | number>,
  extraFiles?: Record<string, File | null>,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  Object.entries(fields).forEach(([key, value]) => formData.append(key, String(value)));
  Object.entries(extraFiles || {}).forEach(([key, value]) => { if (value) formData.append(key, value); });

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/convert/${endpoint}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  const taskId = isRecord(response.data) ? response.data.taskId : undefined;
  if (typeof taskId !== 'string' || !taskId.trim()) {
    throw new Error('Invalid conversion response: missing taskId');
  }
  return taskId;
}

export function parseApiError(error: unknown, fallback: string): ApiError {
  const payload = getErrorPayload(error);
  const message = normalizeMessage(payload?.message) ??
    normalizeMessage(payload?.error) ??
    fallback;

  return {
    message,
    statusCode: typeof payload?.statusCode === 'number' ? payload.statusCode : undefined,
    code: typeof payload?.code === 'string' ? payload.code : undefined,
    retryable: typeof payload?.retryable === 'boolean' ? payload.retryable : undefined,
    requestId: typeof payload?.requestId === 'string' ? payload.requestId : undefined,
  };
}

export function pdfToolError(error: unknown, fallback: string): string {
  return parseApiError(error, fallback).message;
}

function getErrorPayload(error: unknown): ErrorPayload | undefined {
  if (!isRecord(error)) return undefined;
  const response = isRecord(error.response) ? error.response : undefined;
  const data = response && isRecord(response.data) ? response.data : undefined;
  return (data ?? error) as ErrorPayload;
}

function normalizeMessage(message: unknown): string | undefined {
  if (typeof message === 'string' && message) return message;
  if (Array.isArray(message)) {
    const messages = message.filter((item): item is string => typeof item === 'string' && Boolean(item));
    return messages.length ? messages.join('；') : undefined;
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
