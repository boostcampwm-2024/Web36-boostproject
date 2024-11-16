import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Shell {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  sessionId: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'text', nullable: true })
  query: string;

  @Column({ nullable: true })
  runTime: string;

  @Column({ nullable: true })
  queryType: string;

  @Column({ nullable: true })
  failMessage: string;

  @Column({ nullable: true })
  affectedRows: number;

  @Column({ type: 'json', nullable: true })
  resultTable: object;

  @Column({ nullable: true })
  queryStatus: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
