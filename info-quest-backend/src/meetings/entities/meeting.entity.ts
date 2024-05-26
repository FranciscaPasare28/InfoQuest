import { Permission } from 'src/roles/entities/permission.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startHour: string;

  @Column()
  endHour: string;

  @Column()
  meetingDay: string;

  @Column()
  meetingPermissionId: number;

}