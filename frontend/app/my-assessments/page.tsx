'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { quizService, Quiz, QuizStatus, Question, QuestionType } from '@/lib/quiz';
import { FileQuestion, Clock, CheckCircle, Play, AlertCircle } from 'lucide-react';
import { toast } from '@/lib/toast';

export default function MyAssessmentsPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');
  const [mounted, setMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

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

      // Only students can view assessments
      if (authService.isInstructor()) {
        router.replace('/dashboard');
        return;
      }

      setCheckingAuth(false);
      loadQuizzes();
    };

    checkAuth();
  }, [filter]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const allQuizzes = await quizService.getAll(QuizStatus.PUBLISHED);
      
      // In a real app, you'd check completion status from results
      // For now, we'll show all as available
      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
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
            {
              id: 'q1',
              quizId: '1',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What is the primary goal when building a digital agency?',
              options: [
                'Maximize client count',
                'Build sustainable recurring revenue',
                'Focus only on high-ticket clients',
                'Minimize operational costs',
              ],
              correctAnswers: [1],
              explanation: 'Building sustainable recurring revenue ensures long-term growth and stability for your agency.',
              points: 10,
              order: 0,
            },
            {
              id: 'q2',
              quizId: '1',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'Which client acquisition method typically has the highest conversion rate for agencies?',
              options: [
                'Cold emailing',
                'Social media ads',
                'Referrals and testimonials',
                'Content marketing',
              ],
              correctAnswers: [2],
              explanation: 'Referrals and testimonials have the highest conversion rate because they come with built-in trust.',
              points: 10,
              order: 1,
            },
            {
              id: 'q3',
              quizId: '1',
              type: QuestionType.TRUE_FALSE,
              prompt: 'Hiring employees should always be prioritized over hiring contractors when scaling an agency.',
              options: ['True', 'False'],
              correctAnswers: [1],
              explanation: 'Contractors offer more flexibility and lower overhead costs, especially in early growth stages.',
              points: 10,
              order: 2,
            },
            {
              id: 'q4',
              quizId: '1',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What percentage of revenue should ideally go towards operational expenses in a profitable agency?',
              options: ['30-40%', '50-60%', '70-80%', '90%+'],
              correctAnswers: [0],
              explanation: 'Keeping operational expenses at 30-40% ensures healthy profit margins and sustainable growth.',
              points: 10,
              order: 3,
            },
            {
              id: 'q5',
              quizId: '1',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'Which metric is most important for tracking agency health?',
              options: [
                'Total revenue',
                'Monthly recurring revenue (MRR)',
                'Client count',
                'Profit margin',
              ],
              correctAnswers: [1],
              explanation: 'Monthly recurring revenue (MRR) provides predictable income and is key for sustainable agency growth.',
              points: 10,
              order: 4,
            },
          ],
        },
        {
          id: '2',
          title: 'Client Acquisition & Retention Strategies',
          description: 'Master the art of acquiring and retaining clients for long-term agency success.',
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
            {
              id: 'q1',
              quizId: '2',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What is the most effective way to demonstrate value to potential clients?',
              options: [
                'Lowest pricing',
                'Case studies with specific results',
                'Years of experience',
                'Team size',
              ],
              correctAnswers: [1],
              explanation: 'Case studies with specific, measurable results prove your ability to deliver outcomes.',
              points: 10,
              order: 0,
            },
            {
              id: 'q2',
              quizId: '2',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'The best time to ask for a referral is:',
              options: [
                'During onboarding',
                'After delivering exceptional results',
                'At contract renewal',
                'All of the above',
              ],
              correctAnswers: [3],
              explanation: 'All of these moments are opportunities to ask for referrals when the client is happy.',
              points: 10,
              order: 1,
            },
            {
              id: 'q3',
              quizId: '2',
              type: QuestionType.TRUE_FALSE,
              prompt: 'It\'s better to focus on client retention than new client acquisition.',
              options: ['True', 'False'],
              correctAnswers: [0],
              explanation: 'Retaining existing clients costs less and generates more revenue than constantly acquiring new ones.',
              points: 10,
              order: 2,
            },
          ],
        },
        {
          id: '3',
          title: 'eCommerce Product Research & Validation',
          description: 'Learn how to identify profitable products and validate market demand before launching your store.',
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
            {
              id: 'q1',
              quizId: '3',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What is the ideal profit margin for a successful eCommerce product?',
              options: ['10-15%', '20-30%', '40-50%', '60%+'],
              correctAnswers: [2],
              explanation: 'A 40-50% profit margin provides enough room for marketing, operational costs, and sustainable growth.',
              points: 10,
              order: 0,
            },
            {
              id: 'q2',
              quizId: '3',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'Which tool is most effective for validating product demand?',
              options: [
                'Google Trends',
                'Facebook Audience Insights',
                'Amazon Best Sellers',
                'All of the above',
              ],
              correctAnswers: [3],
              explanation: 'Combining multiple validation tools gives a comprehensive view of market demand.',
              points: 10,
              order: 1,
            },
            {
              id: 'q3',
              quizId: '3',
              type: QuestionType.TRUE_FALSE,
              prompt: 'Products with high competition should always be avoided.',
              options: ['True', 'False'],
              correctAnswers: [1],
              explanation: 'High competition often indicates a strong market. You can succeed with differentiation and better marketing.',
              points: 10,
              order: 2,
            },
            {
              id: 'q4',
              quizId: '3',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What is the minimum order quantity (MOQ) you should aim for when starting?',
              options: [
                'As low as possible',
                '100-500 units',
                '1000+ units',
                'Depends on product and capital',
              ],
              correctAnswers: [3],
              explanation: 'MOQ depends on your product type, capital, and risk tolerance. Start small, scale up.',
              points: 10,
              order: 3,
            },
          ],
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
            {
              id: 'q1',
              quizId: '4',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What is the primary purpose of the top of a sales funnel?',
              options: [
                'Make the sale',
                'Build trust and awareness',
                'Collect email addresses',
                'Show pricing',
              ],
              correctAnswers: [1],
              explanation: 'The top of the funnel focuses on building awareness and establishing trust with potential customers.',
              points: 10,
              order: 0,
            },
            {
              id: 'q2',
              quizId: '4',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What is a typical conversion rate for a well-optimized landing page?',
              options: ['1-2%', '5-10%', '15-20%', '25%+'],
              correctAnswers: [1],
              explanation: 'A 5-10% conversion rate is considered excellent for most industries and funnels.',
              points: 10,
              order: 1,
            },
            {
              id: 'q3',
              quizId: '4',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'Which element is most critical for funnel conversion?',
              options: [
                'Beautiful design',
                'Clear value proposition',
                'Multiple payment options',
                'Social proof',
              ],
              correctAnswers: [1],
              explanation: 'A clear value proposition immediately communicates why visitors should take action.',
              points: 10,
              order: 2,
            },
          ],
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
            {
              id: 'q1',
              quizId: '5',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'What is the most important element of persuasive copywriting?',
              options: [
                'Length of content',
                'Understanding your audience',
                'Use of big words',
                'Multiple call-to-actions',
              ],
              correctAnswers: [1],
              explanation: 'Understanding your audience allows you to craft messages that resonate and drive action.',
              points: 10,
              order: 0,
            },
            {
              id: 'q2',
              quizId: '5',
              type: QuestionType.MULTIPLE_CHOICE,
              prompt: 'Which personal branding strategy is most effective for entrepreneurs?',
              options: [
                'Posting daily on all platforms',
                'Consistently sharing valuable insights',
                'Having the most followers',
                'Creating viral content',
              ],
              correctAnswers: [1],
              explanation: 'Consistently sharing valuable insights builds trust and positions you as an expert.',
              points: 10,
              order: 1,
            },
            {
              id: 'q3',
              quizId: '5',
              type: QuestionType.TRUE_FALSE,
              prompt: 'Personal branding is only important for service-based businesses.',
              options: ['True', 'False'],
              correctAnswers: [1],
              explanation: 'Personal branding is valuable for all entrepreneurs as it builds trust and attracts opportunities.',
              points: 10,
              order: 2,
            },
          ],
        },
      ];
      setQuizzes(mockQuizzes);
      // Don't show error toast if we have fallback data
      // toast.error('Failed to load assessments. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (filter === 'all') return true;
    // In a real app, check completion status
    // For demo, we'll simulate some as completed
    if (filter === 'completed') {
      return Math.random() > 0.7; // Simulate 30% completed
    }
    return true;
  });

  const getStatusBadge = (quiz: Quiz) => {
    // Simulate completion status - in real app, check from results
    const isCompleted = Math.random() > 0.7;
    
    if (isCompleted) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Available
      </span>
    );
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Assessments
              </h1>
              <p className="text-gray-600">
                View and take available assessments to test your knowledge
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(['all', 'available', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading assessments...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                {filter === 'completed' ? 'No completed assessments' : 'No assessments available'}
              </h3>
              <p className="text-sm text-gray-500">
                {filter === 'completed'
                  ? 'You haven\'t completed any assessments yet.'
                  : 'Check back later for new assessments from your instructors.'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuizzes.map((quiz) => {
              const isCompleted = Math.random() > 0.7; // Simulate status
              
              return (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(quiz)}
                          <h2 className="font-semibold text-lg text-gray-900">{quiz.title}</h2>
                        </div>
                        {quiz.description && (
                          <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="w-4 h-4" />
                        <span>{quiz.questions?.length || 0} Questions</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{quiz.timeLimit} minutes time limit</span>
                        </div>
                      )}
                      {quiz.maxAttempts > 1 && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{quiz.maxAttempts} attempts allowed</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-6">
                      {isCompleted ? (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => router.push(`/my-results?quiz=${quiz.id}`)}
                            className="flex-1"
                          >
                            View Results
                          </Button>
                          {quiz.maxAttempts > 1 && (
                            <Button
                              onClick={() => router.push(`/quizzes/${quiz.id}/take`)}
                              className="flex-1"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Retake
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          onClick={() => router.push(`/quizzes/${quiz.id}/take`)}
                          className="w-full"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Assessment
                        </Button>
                      )}
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

