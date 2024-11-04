import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Shell {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.shells)
  user: User;

  @Column({ type: 'bigint' })
  shellId: number;

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
