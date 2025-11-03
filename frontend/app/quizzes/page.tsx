'use client';

import { useEffect, useState, useDeferredValue, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { quizService, Quiz, QuizStatus } from '@/lib/quiz';
import {
  Search,
  Plus,
  Edit,
  Eye,
  MoreVertical,
  Filter,
  ChevronDown,
  FileQuestion,
} from 'lucide-react';
import { authService } from '@/lib/auth';
import Link from 'next/link';

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filter, setFilter] = useState<'all' | QuizStatus>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const deferredSearch = useDeferredValue(search);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only instructors can view assessments
    if (!authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }

    loadQuizzes();
  }, [filter, deferredSearch]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAll(
        filter === 'all' ? undefined : filter,
        deferredSearch || undefined,
      );
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: QuizStatus) => {
    switch (status) {
      case QuizStatus.PUBLISHED:
        return 'bg-green-100 text-green-700';
      case QuizStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-700';
      case QuizStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getQuestionCount = (quiz: Quiz) => {
    return quiz.questions?.length || 0;
  };

  const isAssigned = (quiz: Quiz) => {
    return quiz.assignments && quiz.assignments.length > 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900">
                Assessments
              </h1>
              <p className="text-gray-600 mt-1">Measure entrepreneurial skills and knowledge</p>
            </div>
            <Button
              onClick={() => startTransition(() => router.push('/quizzes/new'))}
              className="flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Assessment
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', QuizStatus.PUBLISHED, QuizStatus.DRAFT, QuizStatus.ARCHIVED] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as 'all' | QuizStatus)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors capitalize text-sm ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
              <select className="border-0 focus:outline-none text-sm font-medium">
                <option>Date Created</option>
                <option>Title</option>
                <option>Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16">
            <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6 text-lg">No quizzes found</p>
            <Button
              onClick={() => router.push('/quizzes/new')}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {quizzes.map((quiz, index) => {
              const gradients = [
                'from-blue-500 to-indigo-600',
                'from-purple-500 to-pink-600',
                'from-emerald-500 to-teal-600',
                'from-amber-500 to-orange-500',
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <Card 
                  key={quiz.id} 
                  className="group relative overflow-hidden border-0 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`}></div>
                  <div className="pl-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getStatusColor(
                              quiz.status,
                            )}`}
                          >
                            {quiz.status}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            Last Edited: {formatDate(quiz.lastEdited)}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{quiz.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
                              <span className="text-white font-bold text-xs">{getQuestionCount(quiz)}</span>
                            </div>
                            <span className="font-semibold">Questions</span>
                          </div>
                          <span>•</span>
                          <span className={isAssigned(quiz) ? 'text-emerald-600 font-semibold' : 'text-gray-400'}>
                            {isAssigned(quiz)
                              ? `Assigned to ${quiz.assignments?.[0]?.quiz?.title || 'Course'}`
                              : 'Not Assigned'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-200">
              <button
                onClick={() => startTransition(() => router.push(`/quizzes/${quiz.id}/edit`))}
                        className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2`}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
              <button
                onClick={() => startTransition(() => router.push(`/quizzes/${quiz.id}/preview`))}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

