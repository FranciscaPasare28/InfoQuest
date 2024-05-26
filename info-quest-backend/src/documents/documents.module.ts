import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { SectionsModule } from '../sections/sections.module';
import { ChainService } from './chain.service';
import { OpenAIService } from '../openai/openai.service';
import { PdfService } from './pdf.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { HttpModule } from "@nestjs/axios";
import { AbilityModule } from "../ability/ability.module";
import { AbilityFactory } from "../ability/ability.factory";

@Module({
  imports: [TypeOrmModule.forFeature([Document]), SectionsModule, UsersModule, HttpModule,AbilityModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, ChainService, OpenAIService, PdfService, AbilityFactory],
  exports: [DocumentsService, ChainService],
})
export class DocumentsModule {}
