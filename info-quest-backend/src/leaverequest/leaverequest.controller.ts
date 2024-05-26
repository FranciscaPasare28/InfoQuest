// src/leave-request/leave-request.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LeaveRequestService } from './leaverequest.service';

@Controller('leave-request')
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post()
  async submitLeaveRequest(@Body() requestBody: { name: string; startDate: string; endDate: string }) {
    try {
      const { name, startDate, endDate } = requestBody;
      await this.leaveRequestService.sendLeaveRequestEmail(name, startDate, endDate);
    } catch (error) {
      throw new HttpException('Email sending failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
