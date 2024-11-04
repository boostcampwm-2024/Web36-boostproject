import { Shell } from 'src/shell/shell.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  token: string;

  @Column()
  createdAt: Date;

  @Column()
  deletedAt: Date;

  @OneToMany(() => Shell, (shell) => shell.user)
  shells: Shell[];
}
