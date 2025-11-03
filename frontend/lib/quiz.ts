import api from './api';

export enum QuizStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  MATCHING = 'matching',
  DRAG_DROP = 'drag_drop',
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  status: QuizStatus;
  enableNegativeMarking: boolean;
  showInstantFeedback: boolean;
  showInGradebook: boolean; // Note: Kept for backwards compatibility, UI shows "Show in Performance"
  timeLimit?: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  createdById: string;
  createdAt: string;
  lastEdited: string;
  questions?: Question[];
  assignments?: any[];
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  prompt: string;
  imageUrl?: string;
  options: any[];
  correctAnswers: any[];
  explanation?: string;
  points: number;
  order: number;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  status?: QuizStatus;
  enableNegativeMarking?: boolean;
  showInstantFeedback?: boolean;
  showInGradebook?: boolean;
  timeLimit?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
}

export const quizService = {
  getAll: async (status?: QuizStatus, search?: string): Promise<Quiz[]> => {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get('/quizzes', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Quiz> => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  create: async (data: CreateQuizDto): Promise<Quiz> => {
    const response = await api.post('/quizzes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateQuizDto>): Promise<Quiz> => {
    const response = await api.patch(`/quizzes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/quizzes/${id}`);
  },

  publish: async (id: string): Promise<Quiz> => {
    const response = await api.post(`/quizzes/${id}/publish`);
    return response.data;
  },

  archive: async (id: string): Promise<Quiz> => {
    const response = await api.post(`/quizzes/${id}/archive`);
    return response.data;
  },
};

export const questionService = {
  getByQuiz: async (quizId: string): Promise<Question[]> => {
    const response = await api.get(`/questions/quiz/${quizId}`);
    // Parse JSON strings from backend
    return response.data.map((q: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correctAnswers: typeof q.correctAnswers === 'string' ? JSON.parse(q.correctAnswers) : q.correctAnswers,
    }));
  },

  getById: async (id: string): Promise<Question> => {
    const response = await api.get(`/questions/${id}`);
    const question = response.data;
    // Parse JSON strings from backend
    return {
      ...question,
      options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      correctAnswers: typeof question.correctAnswers === 'string' ? JSON.parse(question.correctAnswers) : question.correctAnswers,
    };
  },

  create: async (data: Partial<Question>): Promise<Question> => {
    // Stringify options and correctAnswers for backend
    const payload = {
      ...data,
      options: Array.isArray(data.options) ? JSON.stringify(data.options) : data.options,
      correctAnswers: Array.isArray(data.correctAnswers) ? JSON.stringify(data.correctAnswers) : data.correctAnswers,
    };
    const response = await api.post('/questions', payload);
    const question = response.data;
    // Parse JSON strings in response
    return {
      ...question,
      options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      correctAnswers: typeof question.correctAnswers === 'string' ? JSON.parse(question.correctAnswers) : question.correctAnswers,
    };
  },

  update: async (id: string, data: Partial<Question>): Promise<Question> => {
    // Stringify options and correctAnswers for backend
    const payload = {
      ...data,
      options: data.options !== undefined 
        ? (Array.isArray(data.options) ? JSON.stringify(data.options) : data.options)
        : undefined,
      correctAnswers: data.correctAnswers !== undefined
        ? (Array.isArray(data.correctAnswers) ? JSON.stringify(data.correctAnswers) : data.correctAnswers)
        : undefined,
    };
    const response = await api.patch(`/questions/${id}`, payload);
    const question = response.data;
    // Parse JSON strings in response
    return {
      ...question,
      options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      correctAnswers: typeof question.correctAnswers === 'string' ? JSON.parse(question.correctAnswers) : question.correctAnswers,
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },

  reorder: async (questionIds: string[]): Promise<void> => {
    await api.put('/questions/reorder', { questionIds });
  },
};

