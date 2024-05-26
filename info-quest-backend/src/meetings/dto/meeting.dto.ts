import { IsNumber, IsString } from 'class-validator';
import { Permission } from 'src/roles/entities/permission.entity';

export class CreateMeetingDto {
  @IsString()
  name: string;

  @IsString()
  startHour: string;

  @IsString()
  endHour: string;

  @IsString()
  meetingDay: string;

  @IsNumber()
  meetingPermissionId: number;

}