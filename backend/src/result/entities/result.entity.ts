import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';

export enum ResultStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column()
  studentId: string;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column()
  quizId: string;

  @ManyToOne(() => Assignment, { nullable: true })
  @JoinColumn({ name: 'assignmentId' })
  assignment: Assignment;

  @Column({ nullable: true })
  assignmentId: string;

  @Column({ type: 'float', nullable: true })
  score: number; // percentage

  @Column({ type: 'int', nullable: true })
  totalQuestions: number;

  @Column({ type: 'int', nullable: true })
  correctAnswers: number;

  @Column({ type: 'text' }) // JSON stringified answers
  answers: string;

  @Column({ type: 'int', nullable: true }) // in seconds
  completionTime: number;

  @Column({ default: ResultStatus.IN_PROGRESS })
  status: ResultStatus;

  @Column({ type: 'int', default: 1 })
  attemptNumber: number;

  @CreateDateColumn()
  startedAt: Date;

  @UpdateDateColumn()
  completedAt: Date;
}

