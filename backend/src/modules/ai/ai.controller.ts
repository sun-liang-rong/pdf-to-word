import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('models')
  async getModels() {
    return this.aiService.listModels();
  }

  @Post('generate')
  async generateText(
    @Body() body: { model: string; prompt: string; stream?: boolean },
  ) {
    return this.aiService.generateText(body.model, body.prompt, body.stream);
  }

  @Post('chat')
  async chat(
    @Body() body: { model: string; messages: Array<{ role: string; content: string }>; stream?: boolean },
  ) {
    return this.aiService.chat(body.model, body.messages, body.stream);
  }
}