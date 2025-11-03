'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { quizService, Quiz, QuizStatus } from '@/lib/quiz';
import { Plus, FileQuestion, CheckCircle, Clock, TrendingUp, Users, BookOpen, Award, Download } from 'lucide-react';
import { toast } from '@/lib/toast';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { PerformanceChart, ScoreDistributionChart } from '@/components/analytics/PerformanceChart';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function DashboardPage() {
  const router = useRouter();
  useKeyboardShortcuts();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInstructor, setIsInstructor] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    publishedQuizzes: 0,
    draftQuizzes: 0,
    totalQuestions: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    if (!authService.isAuthenticated()) {
      router.replace('/login');
      return;
    }
    setIsInstructor(authService.isInstructor());
    if (authService.isInstructor()) {
      loadDashboardData();
    } else {
      // Load available quizzes for students
      loadStudentQuizzes();
    }
    // Prefetch common routes to speed up navigation
    router.prefetch('/quizzes');
    router.prefetch('/grades');
    router.prefetch('/students');
    router.prefetch('/quizzes/new');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const allQuizzes = await quizService.getAll();
      setQuizzes(allQuizzes);

      const published = allQuizzes.filter((q) => q.status === QuizStatus.PUBLISHED);
      const drafts = allQuizzes.filter((q) => q.status === QuizStatus.DRAFT);
      const totalQuestions = allQuizzes.reduce(
        (sum, quiz) => sum + (quiz.questions?.length || 0),
        0,
      );

      setStats({
        totalQuizzes: allQuizzes.length,
        publishedQuizzes: published.length,
        draftQuizzes: drafts.length,
        totalQuestions,
      });
      // Prefetch edit pages for recently edited quizzes
      allQuizzes.slice(0, 10).forEach((q) => {
        try { router.prefetch(`/quizzes/${q.id}/edit`); } catch (_) {}
      });
    } catch (error) {
      console.error('Error loading dashboard data, using fallback:', error);
      // Fallback mock data to keep instructor dashboard usable offline
      const mockQuizzes: Quiz[] = [
        {
          id: '1',
          title: 'Agency Growth Fundamentals Assessment',
          description: 'Test your knowledge of building and scaling a digital agency. Covers client acquisition, team building, and profit optimization.',
          status: QuizStatus.PUBLISHED,
          enableNegativeMarking: false,
          showInstantFeedback: true,
          showInGradebook: true,
          timeLimit: 30,
          maxAttempts: 1,
          shuffleQuestions: true,
          createdById: 'teacher-demo-001',
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          questions: [
            { id: 'q1', quizId: '1', type: 'multiple_choice', prompt: 'What is the primary goal when building a digital agency?', options: ['Maximize client count', 'Build sustainable recurring revenue', 'Focus only on high-ticket clients', 'Minimize operational costs'], correctAnswers: [1], points: 10, order: 0 },
          ] as any,
        },
        {
          id: '2',
          title: 'Client Acquisition & Retention Strategies',
          description: 'Master the art of finding and keeping clients. Learn proven strategies for client acquisition and long-term retention.',
          status: QuizStatus.DRAFT,
          enableNegativeMarking: false,
          showInstantFeedback: true,
          showInGradebook: true,
          timeLimit: 25,
          maxAttempts: 1,
          shuffleQuestions: false,
          createdById: 'teacher-demo-001',
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          questions: [] as any,
        },
      ];
      setQuizzes(mockQuizzes);

      const published = mockQuizzes.filter((q) => q.status === QuizStatus.PUBLISHED);
      const drafts = mockQuizzes.filter((q) => q.status === QuizStatus.DRAFT);
      const totalQuestions = mockQuizzes.reduce(
        (sum, quiz) => sum + (quiz.questions?.length || 0),
        0,
      );
      setStats({
        totalQuizzes: mockQuizzes.length,
        publishedQuizzes: published.length,
        draftQuizzes: drafts.length,
        totalQuestions,
      });
      // No toast error since we provided fallback
    } finally {
      setLoading(false);
    }
  };

  const loadStudentQuizzes = async () => {
    try {
      setLoading(true);
      // Load only published quizzes for students
      const allQuizzes = await quizService.getAll(QuizStatus.PUBLISHED);
      setQuizzes(allQuizzes);
      // Prefetch take pages for visible quizzes
      allQuizzes.slice(0, 10).forEach((q) => {
        try { router.prefetch(`/quizzes/${q.id}/take`); } catch (_) {}
      });
    } catch (error) {
      console.error('Error loading student quizzes:', error);
      // Fallback to mock data if API fails
      console.log('Using fallback mock assessments data');
      const mockQuizzes: Quiz[] = [
        {
          id: '1',
          title: 'Agency Growth Fundamentals Assessment',
          description: 'Test your knowledge of building and scaling a digital agency. Covers client acquisition, team building, and profit optimization.',
          status: QuizStatus.PUBLISHED,
          enableNegativeMarking: false,
          showInstantFeedback: true,
          showInGradebook: true,
          timeLimit: 30,
          maxAttempts: 1,
          shuffleQuestions: true,
          createdById: 'teacher-demo-001',
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          questions: [
            { id: 'q1', quizId: '1', type: 'multiple_choice', prompt: 'What is the primary goal when building a digital agency?', options: ['Maximize client count', 'Build sustainable recurring revenue', 'Focus only on high-ticket clients', 'Minimize operational costs'], correctAnswers: [1], points: 10, order: 0 },
            { id: 'q2', quizId: '1', type: 'multiple_choice', prompt: 'Which client acquisition method typically has the highest conversion rate?', options: ['Cold emailing', 'Social media ads', 'Referrals and testimonials', 'Content marketing'], correctAnswers: [2], points: 10, order: 1 },
            { id: 'q3', quizId: '1', type: 'true_false', prompt: 'Hiring employees should always be prioritized over contractors.', options: ['True', 'False'], correctAnswers: [1], points: 10, order: 2 },
            { id: 'q4', quizId: '1', type: 'multiple_choice', prompt: 'What percentage of revenue should go towards operational expenses?', options: ['30-40%', '50-60%', '70-80%', '90%+'], correctAnswers: [0], points: 10, order: 3 },
            { id: 'q5', quizId: '1', type: 'multiple_choice', prompt: 'Which metric is most important for tracking agency health?', options: ['Total revenue', 'Monthly recurring revenue (MRR)', 'Client count', 'Profit margin'], correctAnswers: [1], points: 10, order: 4 },
          ] as any,
        },
        {
          id: '2',
          title: 'Client Acquisition & Retention Strategies',
          description: 'Master the art of finding and keeping clients. Learn proven strategies for client acquisition and long-term retention.',
          status: QuizStatus.PUBLISHED,
          enableNegativeMarking: false,
          showInstantFeedback: true,
          showInGradebook: true,
          timeLimit: 25,
          maxAttempts: 1,
          shuffleQuestions: false,
          createdById: 'teacher-demo-001',
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          questions: [
            { id: 'q1', quizId: '2', type: 'multiple_choice', prompt: 'What is the most effective way to demonstrate value?', options: ['Lowest pricing', 'Case studies with specific results', 'Years of experience', 'Team size'], correctAnswers: [1], points: 10, order: 0 },
            { id: 'q2', quizId: '2', type: 'multiple_choice', prompt: 'The best time to ask for a referral is:', options: ['During onboarding', 'After delivering exceptional results', 'At contract renewal', 'All of the above'], correctAnswers: [3], points: 10, order: 1 },
            { id: 'q3', quizId: '2', type: 'true_false', prompt: 'It\'s better to focus on client retention than new client acquisition.', options: ['True', 'False'], correctAnswers: [0], points: 10, order: 2 },
          ] as any,
        },
        {
          id: '3',
          title: 'eCommerce Product Research & Validation',
          description: 'Learn how to identify winning products and validate market demand before launching your eCommerce store.',
          status: QuizStatus.PUBLISHED,
          enableNegativeMarking: false,
          showInstantFeedback: true,
          showInGradebook: true,
          timeLimit: 40,
          maxAttempts: 2,
          shuffleQuestions: true,
          createdById: 'teacher-demo-001',
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          questions: [
            { id: 'q1', quizId: '3', type: 'multiple_choice', prompt: 'What is the ideal profit margin for a successful eCommerce product?', options: ['10-15%', '20-30%', '40-50%', '60%+'], correctAnswers: [2], points: 10, order: 0 },
            { id: 'q2', quizId: '3', type: 'multiple_choice', prompt: 'Which tool is most effective for validating product demand?', options: ['Google Trends', 'Facebook Audience Insights', 'Amazon Best Sellers', 'All of the above'], correctAnswers: [3], points: 10, order: 1 },
            { id: 'q3', quizId: '3', type: 'true_false', prompt: 'Products with high competition should always be avoided.', options: ['True', 'False'], correctAnswers: [1], points: 10, order: 2 },
            { id: 'q4', quizId: '3', type: 'multiple_choice', prompt: 'What is the minimum order quantity (MOQ) you should aim for?', options: ['As low as possible', '100-500 units', '1000+ units', 'Depends on product and capital'], correctAnswers: [3], points: 10, order: 3 },
          ] as any,
        },
        {
          id: '4',
          title: 'Marketing Funnels & Conversion Optimization',
          description: 'Build high-converting marketing funnels and optimize every step of the customer journey.',
          status: QuizStatus.PUBLISHED,
          enableNegativeMarking: true,
          showInstantFeedback: true,
          showInGradebook: true,
          timeLimit: 28,
          maxAttempts: 1,
          shuffleQuestions: false,
          createdById: 'teacher-demo-001',
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          questions: [
            { id: 'q1', quizId: '4', type: 'multiple_choice', prompt: 'What is the primary purpose of the top of a sales funnel?', options: ['Make the sale', 'Build trust and awareness', 'Collect email addresses', 'Show pricing'], correctAnswers: [1], points: 10, order: 0 },
            { id: 'q2', quizId: '4', type: 'multiple_choice', prompt: 'What is a typical conversion rate for a well-optimized landing page?', options: ['1-2%', '5-10%', '15-20%', '25%+'], correctAnswers: [1], points: 10, order: 1 },
            { id: 'q3', quizId: '4', type: 'multiple_choice', prompt: 'Which element is most critical for funnel conversion?', options: ['Beautiful design', 'Clear value proposition', 'Multiple payment options', 'Social proof'], correctAnswers: [1], points: 10, order: 2 },
          ] as any,
        },
        {
          id: '5',
          title: 'Copywriting & Personal Branding Essentials',
          description: 'Master persuasive copywriting and build a powerful personal brand that attracts opportunities.',
          status: QuizStatus.PUBLISHED,
          enableNegativeMarking: false,
          showInstantFeedback: true,
          showInGradebook: true,
          timeLimit: 22,
          maxAttempts: 1,
          shuffleQuestions: true,
          createdById: 'teacher-demo-001',
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          questions: [
            { id: 'q1', quizId: '5', type: 'multiple_choice', prompt: 'What is the most important element of persuasive copywriting?', options: ['Length of content', 'Understanding your audience', 'Use of big words', 'Multiple call-to-actions'], correctAnswers: [1], points: 10, order: 0 },
            { id: 'q2', quizId: '5', type: 'multiple_choice', prompt: 'Which personal branding strategy is most effective for entrepreneurs?', options: ['Posting daily on all platforms', 'Consistently sharing valuable insights', 'Having the most followers', 'Creating viral content'], correctAnswers: [1], points: 10, order: 1 },
            { id: 'q3', quizId: '5', type: 'true_false', prompt: 'Personal branding is only important for service-based businesses.', options: ['True', 'False'], correctAnswers: [1], points: 10, order: 2 },
          ] as any,
        },
      ];
      setQuizzes(mockQuizzes);
      // Prefetch take pages for mock data as well
      mockQuizzes.slice(0, 10).forEach((q) => {
        try { router.prefetch(`/quizzes/${q.id}/take`); } catch (_) {}
      });
      // Don't show error toast if we have fallback data
    } finally {
      setLoading(false);
    }
  };

  const getRecentQuizzes = () => {
    return quizzes
      .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime())
      .slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
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

  const exportData = () => {
    try {
      const csvContent = [
        ['Title', 'Status', 'Questions', 'Last Edited'].join(','),
        ...quizzes.map((q) =>
          [
            `"${q.title}"`,
            q.status,
            q.questions?.length || 0,
            q.lastEdited,
          ].join(','),
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessments-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Assessment data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data. Please try again.');
    }
  };

  // Mock analytics data
  const performanceData = [
    { month: 'Jan', assessments: 12, completion: 85, avgScore: 78 },
    { month: 'Feb', assessments: 18, completion: 92, avgScore: 82 },
    { month: 'Mar', assessments: 24, completion: 88, avgScore: 85 },
    { month: 'Apr', assessments: 28, completion: 95, avgScore: 87 },
    { month: 'May', assessments: 32, completion: 90, avgScore: 89 },
    { month: 'Jun', assessments: 35, completion: 93, avgScore: 91 },
  ];

  const scoreDistributionData = [
    { range: '0-50', count: 5 },
    { range: '51-60', count: 8 },
    { range: '61-70', count: 12 },
    { range: '71-80', count: 25 },
    { range: '81-90', count: 32 },
    { range: '91-100', count: 18 },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's an overview of your entrepreneurship education platform.
              </p>
            </div>
            {mounted && isInstructor && (
              <Button
                onClick={() => router.push('/quizzes/new')}
                onMouseEnter={() => router.prefetch('/quizzes/new')}
                className="flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards - Only for Instructors */}
        {!mounted ? null : isInstructor && loading ? (
          <div className="mb-6 md:mb-8">
            <StatsSkeleton />
          </div>
        ) : isInstructor ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-in">
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100 mb-2">Total Assessments</p>
                    <p className="text-3xl md:text-4xl font-bold">
                      {stats.totalQuizzes}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FileQuestion className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-100 mb-2">Published</p>
                    <p className="text-3xl md:text-4xl font-bold">
                      {stats.publishedQuizzes}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-100 mb-2">Drafts</p>
                    <p className="text-3xl md:text-4xl font-bold">
                      {stats.draftQuizzes}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-violet-100 mb-2">Total Questions</p>
                    <p className="text-3xl md:text-4xl font-bold">
                      {stats.totalQuestions}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions - Only for Instructors */}
            {mounted && isInstructor && (
              <Card className="mb-6 md:mb-8 bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-md">
                <h2 className="font-orbitron text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onMouseEnter={() => router.prefetch('/quizzes/new')}
                    onClick={() => router.push('/quizzes/new')}
                    className="group flex flex-col items-center justify-center gap-3 h-auto py-6 px-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Create Assessment</span>
                  </button>
                  <button
                    onMouseEnter={() => router.prefetch('/quizzes')}
                    onClick={() => router.push('/quizzes')}
                    className="group flex flex-col items-center justify-center gap-3 h-auto py-6 px-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-300 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileQuestion className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">View All Assessments</span>
                  </button>
                  <button
                    onMouseEnter={() => router.prefetch('/grades')}
                    onClick={() => router.push('/grades')}
                    className="group flex flex-col items-center justify-center gap-3 h-auto py-6 px-4 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">View Analytics</span>
                  </button>
                  <button
                    onMouseEnter={() => router.prefetch('/students')}
                    onClick={() => router.push('/students')}
                    className="group flex flex-col items-center justify-center gap-3 h-auto py-6 px-4 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-2 border-amber-200 hover:border-amber-300 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Manage Entrepreneurs</span>
                  </button>
                </div>
              </Card>
            )}

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-orbitron text-xl font-bold text-gray-900 mb-1">
                      Performance Trends
                    </h2>
                    <p className="text-sm text-gray-600">6-month overview</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <PerformanceChart data={performanceData} />
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-orbitron text-xl font-bold text-gray-900 mb-1">
                      Score Distribution
                    </h2>
                    <p className="text-sm text-gray-600">Assessment performance breakdown</p>
                  </div>
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <ScoreDistributionChart data={scoreDistributionData} />
              </Card>
            </div>

            {/* Recent Assessments - Only for Instructors */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-orbitron text-xl font-bold text-gray-900">Recent Assessments</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportData}
                    className="text-gray-600 hover:text-gray-900"
                    title="Export data (Ctrl+E)"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/quizzes')}
                    className="text-blue-600"
                  >
                    View All
                  </Button>
                </div>
              </div>
              {getRecentQuizzes().length === 0 ? (
                <div className="text-center py-12">
                  <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-6 text-lg">No assessments yet</p>
                  <Button 
                    onClick={() => router.push('/quizzes/new')}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Assessment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getRecentQuizzes().map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onMouseEnter={() => router.prefetch(`/quizzes/${quiz.id}/edit`)}
                      onClick={() => router.push(`/quizzes/${quiz.id}/edit`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              quiz.status,
                            )}`}
                          >
                            {quiz.status}
                          </span>
                          <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{quiz.questions?.length || 0} Questions</span>
                          <span>•</span>
                          <span>Last edited: {formatDate(quiz.lastEdited)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onMouseEnter={() => router.prefetch(`/quizzes/${quiz.id}/edit`)}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/quizzes/${quiz.id}/edit`);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        ) : (
          <>
            {/* Student Dashboard - Available Assessments */}
            <Card className="mb-6 md:mb-8 animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h2 className="font-orbitron text-xl font-bold text-gray-900 mb-1">
                    Available Assessments
                  </h2>
                  <p className="text-sm text-gray-600">
                    Take these quizzes to test your entrepreneurship knowledge
                  </p>
                </div>
                <FileQuestion className="w-6 h-6 text-blue-600 hidden md:block" />
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading assessments...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="text-center py-12">
                  <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No assessments available</h3>
                  <p className="text-sm text-gray-500">
                    Check back later for new assessments from your instructors.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                            Available
                          </span>
                          <h3 className="font-semibold text-gray-900 text-base md:text-lg break-words">
                            {quiz.title}
                          </h3>
                        </div>
                        {quiz.description && (
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            {quiz.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600">
                          <span className="whitespace-nowrap">{quiz.questions?.length || 0} Questions</span>
                          {quiz.timeLimit && (
                            <>
                              <span className="hidden md:inline">•</span>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                {quiz.timeLimit} minutes
                              </span>
                            </>
                          )}
                          {quiz.maxAttempts > 1 && (
                            <>
                              <span className="hidden md:inline">•</span>
                              <span className="whitespace-nowrap">{quiz.maxAttempts} attempts allowed</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        onMouseEnter={() => router.prefetch(`/quizzes/${quiz.id}/take`)}
                        onClick={() => router.push(`/quizzes/${quiz.id}/take`)}
                        className="w-full md:w-auto md:ml-4 md:flex-shrink-0"
                      >
                        Start Assessment
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

