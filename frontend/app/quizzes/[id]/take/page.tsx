'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { quizService, questionService, Quiz, Question, QuestionType, QuizStatus } from '@/lib/quiz';
import { authService } from '@/lib/auth';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { toast } from '@/lib/toast';

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only students can take quizzes
    if (authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }

    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!quiz?.timeLimit || !started || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz?.timeLimit, started, showResults]);

  const getMockQuizData = (id: string): { quiz: Quiz; questions: Question[] } | null => {
    const mockQuizzes: Record<string, { quiz: Quiz; questions: Question[] }> = {
      '1': {
        quiz: {
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
        },
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
      '2': {
        quiz: {
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
        },
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
      '3': {
        quiz: {
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
        },
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
      '4': {
        quiz: {
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
        },
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
      '5': {
        quiz: {
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
        },
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
    };

    return mockQuizzes[id] || null;
  };

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await quizService.getById(quizId);
      setQuiz(quizData);
      
      const questionsData = await questionService.getByQuiz(quizId);
      setQuestions(questionsData);

      if (quizData.timeLimit) {
        setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      // Try to load mock data as fallback
      const mockData = getMockQuizData(quizId);
      if (mockData) {
        console.log('Using fallback mock quiz data');
        setQuiz(mockData.quiz);
        setQuestions(mockData.questions);
        if (mockData.quiz.timeLimit) {
          setTimeRemaining(mockData.quiz.timeLimit * 60);
        }
      } else {
        toast.error('Failed to load assessment. Please try again.');
        router.push('/my-assessments');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      const correctAnswers = Array.isArray(question.correctAnswers) 
        ? question.correctAnswers 
        : typeof question.correctAnswers === 'string'
        ? JSON.parse(question.correctAnswers)
        : [];
      
      if (userAnswer !== undefined) {
        if (Array.isArray(correctAnswers)) {
          if (Array.isArray(userAnswer)) {
            const userSet = new Set(userAnswer);
            const correctSet = new Set(correctAnswers);
            const isCorrect = 
              userSet.size === correctSet.size &&
              Array.from(userSet).every((ans) => correctSet.has(ans));
            if (isCorrect) {
              correctCount++;
              earnedPoints += question.points;
            }
          } else if (correctAnswers.includes(userAnswer)) {
            correctCount++;
            earnedPoints += question.points;
          }
        } else if (userAnswer === correctAnswers || userAnswer === correctAnswers[0]) {
          correctCount++;
          earnedPoints += question.points;
        }
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    setScore(percentage);
    setShowResults(true);

    // Submit results to backend
    try {
      // TODO: Submit results via API
      toast.success(`Assessment completed! Your score: ${percentage}%`);
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64 flex items-center justify-center">
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Loading assessment...</p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64 flex items-center justify-center">
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Assessment not found</p>
              <Button onClick={() => router.push('/dashboard')} className="mt-4">
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
          {/* Back button at top left */}
          <div className="mb-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <Card className="max-w-2xl mx-auto mt-8">
            <div className="text-center py-8">
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className="text-gray-600 mb-6">{quiz.description}</p>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Assessment Details:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span><strong>Questions:</strong> {questions.length}</span>
                  </li>
                  {quiz.timeLimit && (
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span><strong>Time Limit:</strong> {quiz.timeLimit} minutes</span>
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span><strong>Attempts:</strong> {quiz.maxAttempts}</span>
                  </li>
                  {quiz.showInstantFeedback && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span>Instant feedback enabled</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={handleStart} className="px-8">
                  Start Assessment
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (showResults) {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answers[currentQuestion.id];
    const correctAnswers = Array.isArray(currentQuestion.correctAnswers)
      ? currentQuestion.correctAnswers
      : typeof currentQuestion.correctAnswers === 'string'
      ? JSON.parse(currentQuestion.correctAnswers)
      : [];
    const isCorrect = Array.isArray(correctAnswers)
      ? correctAnswers.includes(userAnswer)
      : userAnswer === correctAnswers;

    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
          <Card className="max-w-3xl mx-auto mt-8">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="font-orbitron text-3xl font-bold text-gray-900 mb-2">
                Assessment Complete!
              </h1>
              <div className="text-4xl font-bold text-blue-600 mb-4">{score}%</div>
              <p className="text-gray-600 mb-8">
                You scored {score}% on {quiz.title}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Review Your Answers:</h3>
                <div className="space-y-4 text-left">
                  {questions.map((q, idx) => {
                    const userAns = answers[q.id];
                    const correctAns = Array.isArray(q.correctAnswers)
                      ? q.correctAnswers
                      : typeof q.correctAnswers === 'string'
                      ? JSON.parse(q.correctAnswers)
                      : [];
                    const isRight = Array.isArray(correctAns)
                      ? correctAns.includes(userAns)
                      : userAns === correctAns;
                    
                    return (
                      <div key={q.id} className="flex items-start gap-3">
                        {isRight ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Question {idx + 1}</p>
                          <p className="text-sm text-gray-600">{q.prompt}</p>
                          {q.explanation && !isRight && (
                            <p className="text-xs text-blue-600 mt-1">
                              <strong>Explanation:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button onClick={() => router.push('/dashboard')} className="px-8">
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = Array.isArray(currentQuestion.options) 
    ? currentQuestion.options 
    : [];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        {/* Back button at top left */}
        <div className="mb-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto mt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="font-orbitron text-xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-red-600">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">
              {currentQuestion.prompt}
            </h2>

            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="space-y-3">
                {options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === QuestionType.TRUE_FALSE && (
              <div className="space-y-3">
                {options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-gray-600">
              {Object.keys(answers).length} of {questions.length} answered
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmit} className="px-6">
                Submit Assessment
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}

