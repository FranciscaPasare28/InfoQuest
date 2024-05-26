// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Meeting } from './entities/meeting.entity';
// import { CreateMeetingDto } from './dto/meeting.dto';
//
// @Injectable()
// export class MeetingService{
//   constructor(
//     @InjectRepository(Meeting)
//     private meetingRepository: Repository<Meeting>,
//   )
//   {}
//
//   async createMeeting(
//     CreateMeetingDto: CreateMeetingDto,
//   ): Promise<Meeting> {
//
//     const meeting =
//       this.meetingRepository.create(CreateMeetingDto);
//     return this.meetingRepository.save(meeting);
//   }
//
//   async getMeetingsByDay(day: string): Promise<Meeting[] | []> {
//     const meetings = await this.meetingRepository.findBy({ meetingDay: day });
//
//     return meetings;
//   }
//
//   async updateMeeting(id: number, meetingDto: CreateMeetingDto): Promise<Meeting> {
//     const meetingToUpdate = await this.meetingRepository.preload({
//       id: id,
//       ...meetingDto,
//     });
//
//     if (!meetingToUpdate) {
//       throw new NotFoundException(`Meeting with ID ${id} not found.`);
//     }
//
//     return this.meetingRepository.save(meetingToUpdate);
//   }
//
//   async deleteMeeting(id: number): Promise<void> {
//     const deleteResult = await this.meetingRepository.delete(id);
//     if (!deleteResult.affected) {
//       throw new NotFoundException(`Meeting with ID ${id} not found.`);
//     }
//   }
// };

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';
import { CreateMeetingDto } from './dto/meeting.dto';
import { UsersService } from 'src/users/users.service';

const nodemailer = require('nodemailer');

@Injectable()
export class MeetingService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'franci.pasare@gmail.com',
      pass: 'snoc wdiz vqmc bswr',
    },
    tls: { rejectUnauthorized: false },
  });

  constructor(
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    private usersService: UsersService, // Serviciul Users pentru obținerea utilizatorilor
  ) {}

  // async createMeeting(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
  //   const meeting = this.meetingRepository.create(createMeetingDto);
  //   const savedMeeting = await this.meetingRepository.save(meeting);
  //   await this.notifyUsers(savedMeeting.meetingPermissionId);
  //   return savedMeeting;
  // }

  async createMeeting(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const meeting = this.meetingRepository.create(createMeetingDto);
    const savedMeeting = await this.meetingRepository.save(meeting);
    await this.notifyUsers(savedMeeting.meetingPermissionId, savedMeeting.meetingDay);
    return savedMeeting;
  }


  //   async createMeeting(
//     CreateMeetingDto: CreateMeetingDto,
//   ): Promise<Meeting> {
//
//     const meeting =
//       this.meetingRepository.create(CreateMeetingDto);
//     return this.meetingRepository.save(meeting);
//   }

    async getMeetingsByDay(day: string): Promise<Meeting[] | []> {
    const meetings = await this.meetingRepository.findBy({ meetingDay: day });

    return meetings;
  }

  // async updateMeeting(id: number, meetingDto: CreateMeetingDto): Promise<Meeting> {
  //   const meetingToUpdate = await this.meetingRepository.preload({
  //     id,
  //     ...meetingDto,
  //   });
  //
  //   if (!meetingToUpdate) {
  //     throw new NotFoundException(`Meeting with ID ${id} not found.`);
  //   }
  //
  //   const updatedMeeting = await this.meetingRepository.save(meetingToUpdate);
  //   await this.notifyUsers(updatedMeeting.meetingPermissionId);
  //   return updatedMeeting;
  // }

  async updateMeeting(id: number, meetingDto: CreateMeetingDto): Promise<Meeting> {
    const meetingToUpdate = await this.meetingRepository.preload({
      id,
      ...meetingDto,
    });

    if (!meetingToUpdate) {
      throw new NotFoundException(`Meeting with ID ${id} not found.`);
    }

    const updatedMeeting = await this.meetingRepository.save(meetingToUpdate);
    await this.notifyUsers(updatedMeeting.meetingPermissionId, updatedMeeting.meetingDay);
    return updatedMeeting;
  }


  // private async notifyUsers(permissionId: number): Promise<void> {
  //   const users = await this.usersService.findUsersByPermission(permissionId);
  //
  //   const emails = users.map(user => user.email);
  //   const mailOptions = {
  //     from: '"Francisca Pasare" <infoquest.testmail@gmail.com>',
  //     to: emails.join(','),
  //     subject: 'Meeting Notification',
  //     text: 'A new meeting has been created or updated. Please check your schedule.',
  //   };
  //
  //   try {
  //     await this.transporter.sendMail(mailOptions);
  //     console.log('Emails sent to:', emails);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // }

  private async notifyUsers(permissionId: number, meetingDay: string): Promise<void> {
    const users = await this.usersService.findUsersByPermission(permissionId);
    const emails = users.map(user => user.email);
    const mailOptions = {
      from: '"Francisca Pasare" <infoquest.testmail@gmail.com>',
      to: emails.join(','),
      subject: 'Meeting Notification',
      text: `Hello!\nWe would like to inform you that a new event has been created or updated for ${meetingDay}. Please check the schedule.\nHave a nice day!`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Emails sent to:', emails);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async getAllMeetings(): Promise<Meeting[]> {
    return this.meetingRepository.find();
  }

  async deleteMeeting(id: number): Promise<void> {
    const deleteResult = await this.meetingRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Meeting with ID ${id} not found.`);
    }
  }
}
