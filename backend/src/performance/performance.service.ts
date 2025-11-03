import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result, ResultStatus } from '../result/entities/result.entity';
import { Quiz } from '../quiz/entities/quiz.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async getClassPerformance(quizId: string) {
    const results = await this.resultRepository.find({
      where: { quizId },
      relations: ['student', 'quiz'],
    });

    const completed = results.filter((r) => r.status === ResultStatus.COMPLETED);
    const total = results.length;

    if (total === 0) {
      return {
        averageScore: 0,
        completionRate: 0,
        toughestQuestion: null,
        topPerformer: null,
      };
    }

    const averageScore =
      completed.length > 0
        ? completed.reduce((sum, r) => sum + (r.score || 0), 0) / completed.length
        : 0;

    const completionRate = (completed.length / total) * 100;

    // Find top performer
    const topPerformer = completed.reduce((top, current) => {
      return !top || (current.score || 0) > (top.score || 0) ? current : top;
    }, null);

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      toughestQuestion: 'Question 7', // TODO: Calculate from actual data
      topPerformer: topPerformer
        ? {
            name: `${topPerformer.student.firstName} ${topPerformer.student.lastName}`,
            score: topPerformer.score,
          }
        : null,
    };
  }

  async getScoreDistribution(quizId: string) {
    const results = await this.resultRepository.find({
      where: { quizId, status: ResultStatus.COMPLETED },
    });

    const ranges = [
      { label: '0-20%', min: 0, max: 20, count: 0 },
      { label: '21-40%', min: 21, max: 40, count: 0 },
      { label: '41-60%', min: 41, max: 60, count: 0 },
      { label: '61-80%', min: 61, max: 80, count: 0 },
      { label: '81-100%', min: 81, max: 100, count: 0 },
    ];

    results.forEach((result) => {
      const score = result.score || 0;
      const range = ranges.find((r) => score >= r.min && score <= r.max);
      if (range) {
        range.count++;
      }
    });

    return ranges;
  }

  async getPerformanceByTopic(quizId: string) {
    // TODO: Implement topic-based performance tracking
    return [
      { topic: 'Algebra', score: 92 },
      { topic: 'Geometry', score: 85 },
      { topic: 'Calculus', score: 65 },
      { topic: 'Statistics', score: 78 },
      { topic: 'Trigonometry', score: 95 },
    ];
  }

  async getLeaderboard(quizId: string, limit: number = 10) {
    const results = await this.resultRepository.find({
      where: { quizId, status: ResultStatus.COMPLETED },
      relations: ['student'],
      order: { score: 'DESC' },
      take: limit,
    });

    return results.map((result, index) => ({
      rank: index + 1,
      student: {
        id: result.student.id,
        name: `${result.student.firstName} ${result.student.lastName}`,
        avatar: result.student.avatar,
      },
      score: result.score,
      points: Math.round((result.score || 0) * 100), // Convert to points
      streak: Math.floor(Math.random() * 15) + 1, // TODO: Calculate actual streak
      achievements: [], // TODO: Implement achievements system
    }));
  }
}

