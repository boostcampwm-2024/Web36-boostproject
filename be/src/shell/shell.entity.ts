import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shell {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unique: true })
  shellId: number;

  // 임시로 nullable 처리
  @Column({ nullable: true })
  sessionId: string;

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
}
