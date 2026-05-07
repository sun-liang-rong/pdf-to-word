import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly ollamaUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.ollamaUrl = this.configService.get('OLLAMA_URL') || 'http://localhost:11434';
  }

  /**
   * 生成文本内容
   * @param model 模型名称
   * @param prompt 提示词
   * @param stream 是否流式输出
   * @returns 生成的文本
   */
  async generateText(
    model: string,
    prompt: string,
    stream: boolean = false,
  ): Promise<string> {
    const payload = {
      model,
      prompt,
      stream,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.ollamaUrl}/api/generate`, payload),
      );

      if (stream) {
        // 流式输出处理
        return this.handleStreamResponse(response.data);
      }

      return response.data.response;
    } catch (error) {
      throw new Error(`Ollama API 调用失败: ${error.message}`);
    }
  }

  /**
   * 聊天模式生成
   * @param model 模型名称
   * @param messages 消息历史
   * @param stream 是否流式输出
   * @returns 生成的回复
   */
  async chat(
    model: string,
    messages: Array<{ role: string; content: string }>,
    stream: boolean = false,
  ): Promise<string> {
    const payload = {
      model,
      messages,
      stream,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.ollamaUrl}/api/chat`, payload),
      );

      if (stream) {
        return this.handleStreamResponse(response.data);
      }

      return response.data.message.content;
    } catch (error) {
      throw new Error(`Ollama 聊天调用失败: ${error.message}`);
    }
  }

  /**
   * 获取可用模型列表
   * @returns 模型列表
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.ollamaUrl}/api/tags`),
      );

      return response.data.models.map((model: any) => model.name);
    } catch (error) {
      throw new Error(`获取模型列表失败: ${error.message}`);
    }
  }

  /**
   * 处理流式响应
   * @param stream 流式数据
   * @returns 完整文本
   */
  private handleStreamResponse(stream: any): string {
    let fullText = '';
    // 流式处理逻辑
    return fullText;
  }
}