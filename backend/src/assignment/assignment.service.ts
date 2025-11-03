import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { QuizService } from '../quiz/quiz.service';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    private quizService: QuizService,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto, userId: string) {
    // Verify quiz exists
    await this.quizService.findOne(createAssignmentDto.quizId);

    const assignment = this.assignmentRepository.create({
      ...createAssignmentDto,
      assignedTo: JSON.stringify(createAssignmentDto.assignedTo),
      startDate: new Date(createAssignmentDto.startDate),
      endDate: new Date(createAssignmentDto.endDate),
      createdById: userId,
    });

    return this.assignmentRepository.save(assignment);
  }

  async findAll(userId?: string): Promise<Assignment[]> {
    const query = this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.quiz', 'quiz')
      .leftJoinAndSelect('assignment.createdBy', 'createdBy');

    if (userId) {
      query.where('assignment.createdById = :userId', { userId });
    }

    query.orderBy('assignment.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['quiz', 'createdBy'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async findByQuiz(quizId: string): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { quizId },
      relations: ['quiz', 'createdBy'],
    });
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
  }
}

