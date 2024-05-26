import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Action } from '../type';
import { SubjectType } from '@casl/ability';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  action: Action | Action[];

  @Column('simple-array')
  subject: SubjectType | SubjectType[];

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roles: Role[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
