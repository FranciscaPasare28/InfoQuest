// src/leave-request/leave-request.module.ts
import { Module } from '@nestjs/common';
import { LeaveRequestController } from './leaverequest.controller';
import { LeaveRequestService } from './leaverequest.service';

@Module({
  imports: [],
  controllers: [LeaveRequestController], // Include the controller
  providers: [LeaveRequestService], // Include the service
})
export class LeaveRequestModule {}
