import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz, QuizStatus } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async create(createQuizDto: CreateQuizDto, userId: string): Promise<Quiz> {
    const quiz = this.quizRepository.create({
      ...createQuizDto,
      createdById: userId,
      status: createQuizDto.status || QuizStatus.DRAFT,
    });
    return this.quizRepository.save(quiz);
  }

  async findAll(
    userId?: string,
    status?: QuizStatus,
    search?: string,
  ): Promise<Quiz[]> {
    const query = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'questions')
      .leftJoinAndSelect('quiz.assignments', 'assignments');

    if (status) {
      query.where('quiz.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(quiz.title LIKE :search OR quiz.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (userId) {
      query.andWhere('quiz.createdById = :userId', { userId });
    }

    query.orderBy('quiz.lastEdited', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, userId?: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions', 'assignments', 'createdBy'],
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    // If userId is provided (instructor), they can only access their own quizzes
    // If userId is undefined (student), they can access any published quiz
    if (userId && quiz.createdById !== userId) {
      throw new UnauthorizedException('You do not have access to this quiz');
    }

    // Students can only access published quizzes
    if (!userId && quiz.status !== QuizStatus.PUBLISHED) {
      throw new UnauthorizedException('This quiz is not available');
    }

    return quiz;
  }

  async update(
    id: string,
    updateQuizDto: UpdateQuizDto,
    userId: string,
  ): Promise<Quiz> {
    const quiz = await this.findOne(id, userId);
    Object.assign(quiz, updateQuizDto);
    return this.quizRepository.save(quiz);
  }

  async remove(id: string, userId: string): Promise<void> {
    const quiz = await this.findOne(id, userId);
    await this.quizRepository.remove(quiz);
  }

  async publish(id: string, userId: string): Promise<Quiz> {
    const quiz = await this.findOne(id, userId);
    quiz.status = QuizStatus.PUBLISHED;
    return this.quizRepository.save(quiz);
  }

  async archive(id: string, userId: string): Promise<Quiz> {
    const quiz = await this.findOne(id, userId);
    quiz.status = QuizStatus.ARCHIVED;
    return this.quizRepository.save(quiz);
  }
}

