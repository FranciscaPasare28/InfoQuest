import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { Seeder } from '../database/seeder';
import { DocumentsModule } from './documents/documents.module';
import { SectionsModule } from './sections/sections.module';
import { AbilityModule } from './ability/ability.module';
import { MessagesModule } from './messages/messages.module';
import { NotesModule } from "./StickyNotes/notes.module";
import { LeaveRequestModule } from "./leaverequest/leaverequest.module";
import { MailModule } from "./mail/mail.module";
import { MeetingModule } from "./meetings/meeting.module";
import { CertificateModule } from "./certificate/certificate.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: 'password',
      database: 'baza',
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    RolesModule,
    AbilityModule,
    UsersModule,
    DocumentsModule,
    SectionsModule,
    MessagesModule,
    NotesModule,
    LeaveRequestModule,
    MailModule,
    MeetingModule,
    CertificateModule,

  ],
  controllers: [AppController],
  providers: [AppService, Seeder],
})
export class AppModule {}
