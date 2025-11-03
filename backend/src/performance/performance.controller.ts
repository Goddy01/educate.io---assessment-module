import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('performance')
@UseGuards(JwtAuthGuard)
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('class/:quizId')
  getClassPerformance(@Param('quizId') quizId: string) {
    return this.performanceService.getClassPerformance(quizId);
  }

  @Get('score-distribution/:quizId')
  getScoreDistribution(@Param('quizId') quizId: string) {
    return this.performanceService.getScoreDistribution(quizId);
  }

  @Get('topics/:quizId')
  getPerformanceByTopic(@Param('quizId') quizId: string) {
    return this.performanceService.getPerformanceByTopic(quizId);
  }

  @Get('leaderboard/:quizId')
  getLeaderboard(@Param('quizId') quizId: string, @Query('limit') limit?: string) {
    return this.performanceService.getLeaderboard(quizId, limit ? parseInt(limit) : 10);
  }
}

