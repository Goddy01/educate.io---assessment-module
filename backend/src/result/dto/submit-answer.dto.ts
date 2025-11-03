import { IsString, IsObject, IsArray, IsOptional } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  quizId: string;

  @IsString()
  @IsOptional()
  assignmentId?: string;

  @IsArray()
  answers: Array<{
    questionId: string;
    answer: any;
  }>;
}

