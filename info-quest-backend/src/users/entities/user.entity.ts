import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { Role } from '../../roles/entities/role.entity';
import { Note } from "../../StickyNotes/entities/note.entity";

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column('json', { nullable: true })
  vacationDays: string[];

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    nullable: true,
  })
  opsToken: string;

  @ManyToOne(() => Role, (role) => role.users, { cascade: ['update'] })
  @JoinColumn()
  role: Role;

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

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  @OneToMany(() => Note, note => note.user)
  notes: Note[];
}
