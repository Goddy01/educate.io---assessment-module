import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result, ResultStatus } from './entities/result.entity';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { QuizService } from '../quiz/quiz.service';
import { QuestionService } from '../question/question.service';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    private quizService: QuizService,
    private questionService: QuestionService,
  ) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto, studentId: string) {
    const quiz = await this.quizService.findOne(submitAnswerDto.quizId);
    const questions = await this.questionService.findAll(submitAnswerDto.quizId);

    // Check for existing in-progress result
    let result = await this.resultRepository.findOne({
      where: {
        quizId: submitAnswerDto.quizId,
        studentId,
        status: ResultStatus.IN_PROGRESS,
      },
    });

    if (!result) {
      result = this.resultRepository.create({
        quizId: submitAnswerDto.quizId,
        assignmentId: submitAnswerDto.assignmentId,
        studentId,
        status: ResultStatus.IN_PROGRESS,
        answers: JSON.stringify(submitAnswerDto.answers),
        totalQuestions: questions.length,
        attemptNumber: 1,
      });
    } else {
      result.answers = JSON.stringify(submitAnswerDto.answers);
    }

    return this.resultRepository.save(result);
  }

  async completeQuiz(quizId: string, studentId: string, completionTime: number) {
    const result = await this.resultRepository.findOne({
      where: {
        quizId,
        studentId,
        status: ResultStatus.IN_PROGRESS,
      },
      relations: ['quiz'],
    });

    if (!result) {
      throw new NotFoundException('No active quiz session found');
    }

    const quiz = await this.quizService.findOne(quizId);
    const questions = await this.questionService.findAll(quizId);
    const answers = JSON.parse(result.answers);

    // Calculate score
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of questions) {
      const questionAnswer = answers.find((a: any) => a.questionId === question.id);
      const correctAnswers = JSON.parse(question.correctAnswers);
      const points = question.points || 1;

      totalPoints += points;

      if (questionAnswer) {
        const isCorrect = this.checkAnswer(questionAnswer.answer, correctAnswers, question.type);
        if (isCorrect) {
          correctCount++;
          earnedPoints += points;
        } else if (quiz.enableNegativeMarking) {
          earnedPoints -= points * 0.25; // Deduct 25% for wrong answer
        }
      }
    }

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    result.score = Math.max(0, score); // Ensure score doesn't go negative
    result.correctAnswers = correctCount;
    result.completionTime = completionTime;
    result.status = ResultStatus.COMPLETED;
    result.completedAt = new Date();

    return this.resultRepository.save(result);
  }

  private checkAnswer(userAnswer: any, correctAnswers: any[], questionType: string): boolean {
    if (questionType === 'multiple_choice' || questionType === 'true_false') {
      return correctAnswers.includes(userAnswer);
    }
    // Add more logic for matching, drag_drop, etc.
    return JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswers.sort());
  }

  async findAll(quizId?: string, studentId?: string): Promise<Result[]> {
    const query = this.resultRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.student', 'student')
      .leftJoinAndSelect('result.quiz', 'quiz');

    if (quizId) {
      query.where('result.quizId = :quizId', { quizId });
    }

    if (studentId) {
      query.andWhere('result.studentId = :studentId', { studentId });
    }

    query.orderBy('result.completedAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Result> {
    const result = await this.resultRepository.findOne({
      where: { id },
      relations: ['student', 'quiz', 'assignment'],
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    return result;
  }

  async getClassStatistics(quizId: string) {
    const results = await this.findAll(quizId);

    if (results.length === 0) {
      return {
        averageScore: 0,
        completionRate: 0,
        totalStudents: 0,
        completedStudents: 0,
      };
    }

    const completed = results.filter((r) => r.status === ResultStatus.COMPLETED);
    const totalScore = completed.reduce((sum, r) => sum + (r.score || 0), 0);
    const averageScore = completed.length > 0 ? totalScore / completed.length : 0;

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: Math.round((completed.length / results.length) * 100),
      totalStudents: results.length,
      completedStudents: completed.length,
    };
  }
}

