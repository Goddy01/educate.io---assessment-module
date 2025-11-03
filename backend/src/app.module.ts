import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { AssignmentModule } from './assignment/assignment.module';
import { ResultModule } from './result/result.module';
import { AuthModule } from './auth/auth.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'quiz-module.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
      logging: false,
    }),
    AuthModule,
    QuizModule,
    QuestionModule,
    AssignmentModule,
    ResultModule,
    PerformanceModule,
  ],
})
export class AppModule {}

