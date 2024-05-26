import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { ChainService } from '../documents/chain.service';
import { AbilityFactory } from '../ability/ability.factory';
import { DocumentsService } from '../documents/documents.service';
import { UsersService } from '../users/users.service';
import { Action } from '../roles/type';
import { MessagesHistoryService } from '../history/messageshistory.service';
import { CreateMessageHistoryDto } from '../history/dto/messageshistory.dto';

@WebSocketGateway({ path: '/messages' })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;
  private chain;
  constructor(
    private readonly castleAbility: AbilityFactory,
    private readonly usersService: UsersService,
    private readonly chainService: ChainService,
    private readonly documentsService: DocumentsService,
    private readonly messagesHistoryService: MessagesHistoryService,
  ) {}

  async handleConnection() {
    this.chain = await this.chainService.initializeChain();
  }

  @SubscribeMessage('messages')
  async handleMessage(
    @MessageBody() data: { message: string; userId: string },
  ) {
    const user = await this.usersService.findOneWithOptions(
      { id: parseInt(data.userId) },
      { relations: ['role', 'role.permissions'] },
    );
    const ability = this.castleAbility.createForUser(user);
    if (this.chain) {
      const answer = await this.chain.call({
        query: data.message,
      });

      const createMessageHistoryDto = new CreateMessageHistoryDto();
      createMessageHistoryDto.userId = data.userId;
      createMessageHistoryDto.message = data.message;
      createMessageHistoryDto.response = answer.text;

      await this.messagesHistoryService.createMessage(createMessageHistoryDto);
      if (ability.can(Action.Manage, 'Section')) {
        return answer.text;
      }

      for (const a of answer.sourceDocuments) {
        const document = await this.documentsService.findDocumentByPath(a.metadata.source);
        if (!document) {
          // Handle the case where no document is found
          return 'Document not found or access denied';
        }

        for (const sec of document.sections) {
          if (!ability.can(Action.Read, sec.permissionSubject)) {
            const message = await this.chain.call({
              query: `Can you disclose the owner of ${a.metadata.source}, or state if the owner remains unidentified?`,
            });
            return `Access to this data is restricted. For inquiries, please reach out to ${message.text}.`;
          }
        }
      }

      return answer.text;
    }
    return 'Currently, the database does not contain any documents.';
  }

  @SubscribeMessage('loadHistory')
  async handleLoadHistory(@MessageBody() data: { userId: string }) {
    const history = await this.messagesHistoryService.loadUserHistory(
      data.userId,
    );

    return history;
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(@MessageBody() data: { messageId: string }) {
    await this.messagesHistoryService.deleteMessage(data.messageId);
    return { status: 'success', messageId: data.messageId };
  }
}
