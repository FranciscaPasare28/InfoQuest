import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('generate')
  async generateText(
    @Body() body: { prompt: string },
  ): Promise<{ summary: string; isVacation: boolean }> {
    return this.openAIService.generateSummary(body.prompt);
  }
}
