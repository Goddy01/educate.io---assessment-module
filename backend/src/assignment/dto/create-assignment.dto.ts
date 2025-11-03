import { IsString, IsBoolean, IsDateString, IsArray, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  quizId: string;

  @IsString()
  assignType: string; // 'courses', 'classes', or 'students'

  @IsArray()
  assignedTo: string[]; // Array of IDs

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  allowMultipleAttempts?: boolean;

  @IsBoolean()
  @IsOptional()
  showScoreImmediately?: boolean;
}

