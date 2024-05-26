import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageHistory } from './entities/messageshistory.entity';
import { CreateMessageHistoryDto } from './dto/messageshistory.dto';

@Injectable()
export class MessagesHistoryService {
  constructor(
    @InjectRepository(MessageHistory)
    private messageHistoryRepository: Repository<MessageHistory>,
  ) // Adaugă aici orice alte dependențe, cum ar fi serviciul User, dacă este necesar
  {}

  async createMessage(
    createMessageDto: CreateMessageHistoryDto,
  ): Promise<MessageHistory> {
    // Transformă DTO-ul într-o entitate și o salvează
    const messageHistory =
      this.messageHistoryRepository.create(createMessageDto);
    return this.messageHistoryRepository.save(messageHistory);
  }
  async loadUserHistory(userId: string): Promise<MessageHistory[]> {
    return this.messageHistoryRepository.find({
      where: { userId: userId },
      order: { timestamp: 'ASC' },
    });
  }

  async getConversationDetails(
    conversationId: string,
  ): Promise<MessageHistory> {
    // Încarcă detalii despre o anumită conversație
    return this.messageHistoryRepository.findOne({
      where: { id: conversationId },
      relations: ['user'],
    });
  }

  async deleteMessage(conversationId: string): Promise<void> {
    // Șterge o anumită conversație din istoric
    await this.messageHistoryRepository.delete(conversationId);
  }
}
