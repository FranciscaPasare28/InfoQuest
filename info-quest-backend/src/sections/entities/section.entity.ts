import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @Column()
  name: string;

  @Column()
  permissionSubject: string;
}
