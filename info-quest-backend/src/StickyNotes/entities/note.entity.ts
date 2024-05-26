// src/notes/entities/note.entities.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  color: string;

  @Column()
  x: number; // Poziția pe axa X

  @Column()
  y: number; // Poziția pe axa Y

  @ManyToOne(() => User, user => user.notes)
  user: User;

  @Column()
  userId: number;
}
