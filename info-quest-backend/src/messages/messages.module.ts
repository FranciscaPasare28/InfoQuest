import { Module } from '@nestjs/common';

import { MessagesGateway } from './massages.gateway';
import { DocumentsModule } from '../documents/documents.module';
import { AbilityModule } from '../ability/ability.module';
import { UsersModule } from '../users/users.module';
import { MessagesHistoryModule } from '../history/messageshistory.module';

@Module({
  imports: [DocumentsModule, AbilityModule, UsersModule, MessagesHistoryModule],
  providers: [MessagesGateway],
})
export class MessagesModule {}
