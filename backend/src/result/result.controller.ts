import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('results')
@UseGuards(JwtAuthGuard)
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('submit')
  submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto, @Request() req) {
    return this.resultService.submitAnswer(submitAnswerDto, req.user.id);
  }

  @Post('complete')
  completeQuiz(
    @Body() body: { quizId: string; completionTime: number },
    @Request() req,
  ) {
    return this.resultService.completeQuiz(body.quizId, req.user.id, body.completionTime);
  }

  @Get()
  findAll(@Query('quizId') quizId?: string, @Query('studentId') studentId?: string) {
    return this.resultService.findAll(quizId, studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(id);
  }

  @Get('quiz/:quizId/statistics')
  getClassStatistics(@Param('quizId') quizId: string) {
    return this.resultService.getClassStatistics(quizId);
  }
}

