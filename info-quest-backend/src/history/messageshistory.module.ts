import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesHistoryService } from './messageshistory.service';
import { MessageHistory } from './entities/messageshistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageHistory])],
  providers: [MessagesHistoryService],
  exports: [MessagesHistoryService],
})
export class MessagesHistoryModule {}
