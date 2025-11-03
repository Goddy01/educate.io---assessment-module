import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Result } from '../../result/entities/result.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column()
  quizId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @Column({ type: 'text' }) // JSON stringified array of IDs
  assignedTo: string; // Course, Class, or Student IDs

  @Column({ type: 'varchar' })
  assignType: string; // 'courses', 'classes', or 'students'

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ default: false })
  shuffleQuestions: boolean;

  @Column({ default: false })
  allowMultipleAttempts: boolean;

  @Column({ default: true })
  showScoreImmediately: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Result, (result) => result.assignment)
  results: Result[];
}

