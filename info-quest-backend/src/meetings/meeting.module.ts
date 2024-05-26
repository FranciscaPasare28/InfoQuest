import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    UsersModule, // Importă UsersModule aici pentru a avea acces la UserRepository și RoleRepository
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService]
})
export class MeetingModule {}
