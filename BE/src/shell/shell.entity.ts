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
  @Column()
  sessionId: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'text', nullable: true })
  query: string;

  @Column({ nullable: true })
  runTime: string = null;

  @Column({ nullable: true })
  queryType: string = null;

  @Column({ nullable: true })
  failMessage: string = null;

  @Column({ nullable: true })
  affectedRows: number = null;

  @Column({ nullable: true })
  countRows: number = null;

  @Column({ type: 'json', nullable: true })
  resultTable: object = null;

  @Column({ nullable: true })
  queryStatus: boolean = null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  text: string = null;
}
