import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizStatus } from './entities/quiz.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto, @Request() req) {
    return this.quizService.create(createQuizDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('status') status?: QuizStatus,
    @Query('search') search?: string,
    @Request() req?,
  ) {
    // If status is 'published', students can see all published quizzes
    // Otherwise, filter by creator (for instructors)
    const userId = status === QuizStatus.PUBLISHED ? undefined : req.user?.id;
    return this.quizService.findAll(userId, status, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // Students can view published quizzes, instructors can view their own
    return this.quizService.findOne(id, req.user?.role === 'instructor' ? req.user.id : undefined);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @Request() req,
  ) {
    return this.quizService.update(id, updateQuizDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.quizService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string, @Request() req) {
    return this.quizService.publish(id, req.user.id);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string, @Request() req) {
    return this.quizService.archive(id, req.user.id);
  }
}

