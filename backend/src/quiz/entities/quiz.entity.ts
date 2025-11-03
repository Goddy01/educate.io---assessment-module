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
import { Question } from '../../question/entities/question.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Result } from '../../result/entities/result.entity';

export enum QuizStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: QuizStatus.DRAFT })
  status: QuizStatus;

  @Column({ default: false })
  enableNegativeMarking: boolean;

  @Column({ default: true })
  showInstantFeedback: boolean;

  @Column({ default: true })
  showInGradebook: boolean;

  @Column({ nullable: true })
  timeLimit: number; // in minutes

  @Column({ default: 1 })
  maxAttempts: number;

  @Column({ default: false })
  shuffleQuestions: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastEdited: Date;

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions: Question[];

  @OneToMany(() => Assignment, (assignment) => assignment.quiz)
  assignments: Assignment[];

  @OneToMany(() => Result, (result) => result.quiz)
  results: Result[];
}

