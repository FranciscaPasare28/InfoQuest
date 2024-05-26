import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Section } from '../../sections/entities/section.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  path: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @Column('longtext')
  summary?: string;

  @Column()
  uploadDate: Date;

  @ManyToMany(() => Section, { cascade: true })
  @JoinTable({
    joinColumn: { name: 'documentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'sectionId', referencedColumnName: 'id' },
  })
  sections: Section[];
}
