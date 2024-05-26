import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { Section } from './entities/section.entity';
import { SectionDto } from './dto/section.dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionService: SectionsService) {}

  @Get('all')
  async getAllSections(): Promise<Section[]> {
    try {
      return await this.sectionService.getAllSections();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async getSection(@Param('id') id: number): Promise<Section | null> {
    try {
      const section = await this.sectionService.getSection(id);
      if (!section) {
        throw new NotFoundException(`Section with ID ${id} not found.`);
      }
      return section;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post()
  async createSection(@Body() sectionDto: SectionDto): Promise<Section> {
    try {
      return await this.sectionService.createSection(sectionDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateSection(
    @Param('id') id: number,
    @Body() sectionDto: SectionDto,
  ): Promise<Section> {
    try {
      const updatedSection = await this.sectionService.updateSection(
        id,
        sectionDto,
      );
      if (!updatedSection) {
        throw new NotFoundException(`Section with ID ${id} not found.`);
      }
      return updatedSection;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteSection(@Param('id') id: number): Promise<void> {
    try {
      await this.sectionService.deleteSection(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
