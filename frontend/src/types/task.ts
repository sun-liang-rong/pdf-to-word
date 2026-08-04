export type TaskState = "waiting" | "processing" | "completed" | "failed";

export interface ConversionTaskResult {
  id: string;
  status: TaskState;
  progress: number;
  originalName: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  outputFileName: string;
  inputSize: number | null;
  outputSize: number | null;
  canDownload: boolean;
  downloadUrl?: string;
  error?: string;
}
