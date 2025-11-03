import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../entities/question.entity';

export class CreateQuestionDto {
  @IsString()
  quizId: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  prompt: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  options: any[]; // Array of options/answers

  @IsArray()
  correctAnswers: any[]; // Array of correct answer indices/values

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsOptional()
  order?: number;
}

