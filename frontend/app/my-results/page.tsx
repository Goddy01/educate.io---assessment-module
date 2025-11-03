'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { Award, TrendingUp, Clock, FileQuestion, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface Result {
  id: string;
  quizTitle: string;
  course: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  timeSpent: number;
  questionBreakdown: {
    total: number;
    correct: number;
    incorrect: number;
  };
}

export default function MyResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    totalTimeSpent: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkAuth = async () => {
      setMounted(true);
      
      // Small delay to ensure component renders
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (!authService.isAuthenticated()) {
        router.replace('/login');
        return;
      }

      // Only students can view their results
      if (authService.isInstructor()) {
        router.replace('/dashboard');
        return;
      }

      setCheckingAuth(false);
      loadResults();
    };

    checkAuth();
    // Prefetch list/detail routes commonly used here
    try {
      router.prefetch('/my-assessments');
    } catch (_) {}
  }, [router]);

  const loadResults = async () => {
    try {
      setLoading(true);
      // Mock data for student results
      const mockResults: Result[] = [
        {
          id: '1',
          quizTitle: 'Agency Growth Fundamentals Assessment',
          course: 'AGM101',
          score: 45,
          maxScore: 50,
          percentage: 90,
          completedAt: '2024-03-15',
          timeSpent: 32,
          questionBreakdown: {
            total: 5,
            correct: 5,
            incorrect: 0,
          },
        },
        {
          id: '2',
          quizTitle: 'Client Acquisition & Retention Strategies',
          course: 'AGM101',
          score: 28,
          maxScore: 30,
          percentage: 93,
          completedAt: '2024-03-14',
          timeSpent: 25,
          questionBreakdown: {
            total: 3,
            correct: 3,
            incorrect: 0,
          },
        },
        {
          id: '3',
          quizTitle: 'eCommerce Product Research & Validation',
          course: 'ECM201',
          score: 32,
          maxScore: 40,
          percentage: 80,
          completedAt: '2024-03-13',
          timeSpent: 38,
          questionBreakdown: {
            total: 4,
            correct: 3,
            incorrect: 1,
          },
        },
        {
          id: '4',
          quizTitle: 'Marketing Funnels & Conversion Optimization',
          course: 'ECM201',
          score: 25,
          maxScore: 30,
          percentage: 83,
          completedAt: '2024-03-12',
          timeSpent: 28,
          questionBreakdown: {
            total: 3,
            correct: 3,
            incorrect: 0,
          },
        },
        {
          id: '5',
          quizTitle: 'Copywriting & Personal Branding Essentials',
          course: 'CPB301',
          score: 27,
          maxScore: 30,
          percentage: 90,
          completedAt: '2024-03-10',
          timeSpent: 22,
          questionBreakdown: {
            total: 3,
            correct: 3,
            incorrect: 0,
          },
        },
      ];

      setResults(mockResults);

      // Calculate stats
      const totalAttempts = mockResults.length;
      const avgScore = mockResults.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts;
      const highestScore = Math.max(...mockResults.map((r) => r.percentage));
      const totalTime = mockResults.reduce((sum, r) => sum + r.timeSpent, 0);

      setStats({
        totalAttempts,
        averageScore: Math.round(avgScore),
        highestScore,
        totalTimeSpent: totalTime,
      });
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!mounted || checkingAuth) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        <div className="mb-6 md:mb-8">
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            My Results
          </h1>
          <p className="text-gray-600">View your assessment results and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 mb-1">Total Attempts</p>
                <p className="text-3xl font-bold">{stats.totalAttempts}</p>
              </div>
              <FileQuestion className="w-10 h-10 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100 mb-1">Average Score</p>
                <p className="text-3xl font-bold">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100 mb-1">Highest Score</p>
                <p className="text-3xl font-bold">{stats.highestScore}%</p>
              </div>
              <Award className="w-10 h-10 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-100 mb-1">Time Spent</p>
                <p className="text-2xl font-bold">{stats.totalTimeSpent}m</p>
              </div>
              <Clock className="w-10 h-10 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No results yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Complete assessments to see your results here.
              </p>
              <Button onClick={() => router.push('/my-assessments')}>
                View Assessments
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${getScoreColor(result.percentage)}`}>
                          {result.percentage}%
                        </span>
                        <h3 className="font-semibold text-gray-900 text-base md:text-lg break-words flex-1 min-w-0">
                          {result.quizTitle}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                          {result.course}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600 mt-3">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {result.questionBreakdown.correct} correct
                        </span>
                        {result.questionBreakdown.incorrect > 0 && (
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            {result.questionBreakdown.incorrect} incorrect
                          </span>
                        )}
                        <span className="hidden md:inline">•</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          {result.timeSpent} minutes
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span className="whitespace-nowrap">{formatDate(result.completedAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 md:gap-0 md:ml-4 md:flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                      <p className="text-2xl font-bold text-blue-600">
                        {result.score}/{result.maxScore}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onMouseEnter={() => router.prefetch(`/my-results/${result.id}`)}
                        onClick={() => router.push(`/my-results/${result.id}`)}
                        className="text-gray-600 w-auto"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

