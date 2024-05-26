import { Controller, Get, Post, Body, BadRequestException, Param, Put, Delete, InternalServerErrorException } from '@nestjs/common';
import { CreateMeetingDto } from './dto/meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post('create')
  async create(@Body() createMeetingDto: CreateMeetingDto): Promise<Meeting> {

    try {
      return await this.meetingService.createMeeting(createMeetingDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('getAllMeetings')
  async getAllMeetings(): Promise<Meeting[]> {
    try {
      return await this.meetingService.getAllMeetings();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('getMeetingsByDay/:day')
  async getMeetingsByDay(@Param('day') day: string): Promise<Meeting[]> {
    try {
      return await this.meetingService.getMeetingsByDay(day);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('update/:id')
  async updateMeeting(@Body() meetingDto : CreateMeetingDto, @Param('id') id : number): Promise<Meeting> {
    try {
      return await this.meetingService.updateMeeting(id, meetingDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('delete/:id')
  async deleteMeeting(@Param('id') id: number): Promise<void> {
    try {
      await this.meetingService.deleteMeeting(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}