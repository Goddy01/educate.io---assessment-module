'use client';

import { useEffect, useState, useDeferredValue, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import { authService } from '@/lib/auth';
import { GraduationCap, TrendingUp, Award, BookOpen, Search, Filter } from 'lucide-react';

interface Grade {
  id: string;
  studentName: string;
  quizTitle: string;
  course: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  status: 'completed' | 'pending' | 'graded';
}

export default function GradesPage() {
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only instructors can view performance/analytics
    if (!authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }

    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      // Mock data for demo - entrepreneurship focused
      const mockGrades: Grade[] = [
        {
          id: '1',
          studentName: 'Alex Johnson',
          quizTitle: 'Agency Growth Fundamentals Assessment',
          course: 'AGM101',
          score: 87,
          maxScore: 100,
          percentage: 87,
          submittedAt: '2024-03-15',
          status: 'completed',
        },
        {
          id: '2',
          studentName: 'Sarah Williams',
          quizTitle: 'Client Acquisition & Retention Strategies',
          course: 'AGM101',
          score: 94,
          maxScore: 100,
          percentage: 94,
          submittedAt: '2024-03-14',
          status: 'completed',
        },
        {
          id: '3',
          studentName: 'Michael Brown',
          quizTitle: 'eCommerce Product Research & Validation',
          course: 'ECM201',
          score: 82,
          maxScore: 100,
          percentage: 82,
          submittedAt: '2024-03-13',
          status: 'completed',
        },
        {
          id: '4',
          studentName: 'Emily Davis',
          quizTitle: 'Marketing Funnels & Conversion Optimization',
          course: 'ECM201',
          score: 0,
          maxScore: 100,
          percentage: 0,
          submittedAt: '2024-03-16',
          status: 'pending',
        },
        {
          id: '5',
          studentName: 'David Martinez',
          quizTitle: 'Copywriting Fundamentals & Persuasion',
          course: 'CPB301',
          score: 91,
          maxScore: 100,
          percentage: 91,
          submittedAt: '2024-03-12',
          status: 'completed',
        },
        {
          id: '6',
          studentName: 'Jessica Chen',
          quizTitle: 'Personal Branding & Audience Building',
          course: 'CPB301',
          score: 88,
          maxScore: 100,
          percentage: 88,
          submittedAt: '2024-03-11',
          status: 'completed',
        },
      ];
      setGrades(mockGrades);
    } catch (error) {
      console.error('Error loading grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = useMemo(() => {
    const term = deferredSearch.toLowerCase();
    return grades.filter((grade) => {
      const matchesSearch =
        grade.studentName.toLowerCase().includes(term) ||
        grade.quizTitle.toLowerCase().includes(term) ||
        grade.course.toLowerCase().includes(term);
      const matchesFilter = filter === 'all' || grade.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [grades, deferredSearch, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    total: grades.length,
    completed: grades.filter((g) => g.status === 'completed').length,
    pending: grades.filter((g) => g.status === 'pending').length,
    average: grades.filter((g) => g.status === 'completed').length > 0
      ? Math.round(
          grades
            .filter((g) => g.status === 'completed')
            .reduce((sum, g) => sum + g.percentage, 0) /
            grades.filter((g) => g.status === 'completed').length,
        )
      : 0,
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="mb-4">
            <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Performance
            </h1>
            <p className="text-gray-600">
              Monitor entrepreneur progress and identify skill development opportunities
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-2">Total Assessments</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100 mb-2">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-100 mb-2">In Progress</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-violet-100 mb-2">Avg Performance</p>
                  <p className="text-3xl font-bold">{stats.average}%</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by entrepreneur, assessment, or program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'completed', 'pending'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading performance data...</p>
          </div>
        ) : filteredGrades.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-6 text-lg">No assessment results found</p>
              <p className="text-sm text-gray-400">
                Assessment results will appear here as entrepreneurs complete their assessments
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Entrepreneur</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Assessment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Program</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((grade) => (
                    <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{grade.studentName}</td>
                      <td className="py-3 px-4">{grade.quizTitle}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {grade.course}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${getScoreColor(grade.percentage)}`}>
                          {grade.score}/{grade.maxScore} ({grade.percentage}%)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            grade.status,
                          )}`}
                        >
                          {grade.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(grade.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

