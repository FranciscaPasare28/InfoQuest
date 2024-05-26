import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Repository } from 'typeorm';
import { SectionDto } from './dto/section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}

  async getAllSections(): Promise<Section[]> {
    try {
      return await this.sectionRepository.find();
    } catch (error) {
      throw new NotFoundException('Sections not found');
    }
  }

  async getSection(id: number): Promise<Section | null> {
    const section = await this.sectionRepository.findOneBy({ id: id });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found.`);
    }
    return section;
  }

  async createSection(data: SectionDto): Promise<Section> {
    try {
      const newSection = this.sectionRepository.create(data);
      return await this.sectionRepository.save(newSection);
    } catch (error) {
      throw error;
    }
  }

  async updateSection(id: number, sectionDto: SectionDto): Promise<Section> {
    const sectionToUpdate = await this.sectionRepository.preload({
      id: id,
      ...sectionDto,
    });

    if (!sectionToUpdate) {
      throw new NotFoundException(`Section with ID ${id} not found.`);
    }

    return this.sectionRepository.save(sectionToUpdate);
  }

  async deleteSection(id: number): Promise<void> {
    const deleteResult = await this.sectionRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Section with ID ${id} not found.`);
    }
  }
}
