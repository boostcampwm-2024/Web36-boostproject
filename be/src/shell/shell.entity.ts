import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shell {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  shellId: number;

  @Column()
  sessionId: string;

  @Column()
  runTime: string;

  @Column()
  queryType: string;

  @Column()
  failMessage: string;

  @Column()
  affectedRows: number;

  @Column({ type: 'json' })
  resultTable: object;

  @Column()
  queryStatus: boolean;
}
