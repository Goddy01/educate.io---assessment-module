import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuizService } from '../quiz/quiz.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private quizService: QuizService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // Verify quiz exists
    await this.quizService.findOne(createQuestionDto.quizId);

    const question = this.questionRepository.create({
      ...createQuestionDto,
      options: JSON.stringify(createQuestionDto.options),
      correctAnswers: JSON.stringify(createQuestionDto.correctAnswers),
    });

    return this.questionRepository.save(question);
  }

  async findAll(quizId: string): Promise<Question[]> {
    return this.questionRepository.find({
      where: { quizId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findOne(id);
    
    const updateData: any = { ...updateQuestionDto };
    if (updateQuestionDto.options) {
      updateData.options = JSON.stringify(updateQuestionDto.options);
    }
    if (updateQuestionDto.correctAnswers) {
      updateData.correctAnswers = JSON.stringify(updateQuestionDto.correctAnswers);
    }

    Object.assign(question, updateData);
    return this.questionRepository.save(question);
  }

  async remove(id: string): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);
  }

  async reorder(questionIds: string[]): Promise<void> {
    const updatePromises = questionIds.map((id, index) =>
      this.questionRepository.update(id, { order: index }),
    );
    await Promise.all(updatePromises);
  }
}

