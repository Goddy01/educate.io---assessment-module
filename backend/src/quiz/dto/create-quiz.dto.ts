import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { QuizStatus } from '../entities/quiz.entity';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: QuizStatus;

  @IsBoolean()
  @IsOptional()
  enableNegativeMarking?: boolean;

  @IsBoolean()
  @IsOptional()
  showInstantFeedback?: boolean;

  @IsBoolean()
  @IsOptional()
  showInGradebook?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  timeLimit?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxAttempts?: number;

  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;
}

