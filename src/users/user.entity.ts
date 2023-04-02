import { Report } from '@/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
  @OneToMany(() => Report, (report) => report.user)
  reports: Report;
  @AfterInsert()
  logInsert() {
    console.log(`inserted user with id ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`remove user with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`update user with id ${this.id}`);
  }
}
