import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { HttpModule } from "@nestjs/axios";

@Module({
  controllers: [OpenAIController],
  imports: [HttpModule],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
