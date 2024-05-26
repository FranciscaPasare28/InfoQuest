import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class MessageHistory {
  @PrimaryGeneratedColumn('uuid') // Generăm un UUID pentru fiecare intrare pentru unicitate.
  id: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column()
  message: string;

  @Column('longtext')
  response: string;

  @CreateDateColumn()
  timestamp: Date;
}
