'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { BookOpen, Clock, FileQuestion, Award, TrendingUp, User, Target, List, CheckCircle, PlayCircle, ArrowLeft, Users, GraduationCap, Calendar } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  name: string;
  code: string;
  description: string;
  enrolledAt: string;
  progress: number;
  quizCount: number;
  completedQuizzes: number;
  averageScore: number;
  duration?: string;
  modules?: number;
  lessons?: number;
  instructor?: string;
  learningObjectives?: string[];
  courseOutline?: string[];
  prerequisites?: string[];
}

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<EnrolledCourse | null>(null);
  const [loading, setLoading] = useState(true);
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

      // Only students can view their courses
      if (authService.isInstructor()) {
        router.replace('/dashboard');
        return;
      }

      setCheckingAuth(false);
      loadCourse();
    };

    checkAuth();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      // Mock data for enrolled courses - in production, fetch from API
      const mockCourses: Record<string, EnrolledCourse> = {
        '1': {
          id: '1',
          name: 'Agency Growth Mastery',
          code: 'AGM101',
          description: 'Master the fundamentals of building and scaling a digital agency. Learn client acquisition, team building, and profit optimization.',
          enrolledAt: '2024-01-20',
          progress: 65,
          quizCount: 12,
          completedQuizzes: 8,
          averageScore: 87,
          duration: '8 weeks',
          modules: 6,
          lessons: 24,
          instructor: 'Sarah Williams',
          learningObjectives: [
            'Build a sustainable recurring revenue model',
            'Acquire high-value clients through proven strategies',
            'Scale your team effectively with contractors and employees',
            'Optimize profit margins and operational expenses',
            'Implement systems for agency growth and scalability',
            'Master client retention and upsell strategies',
            'Build profitable service packages',
            'Create automated systems for business operations',
          ],
          courseOutline: [
            'Module 1: Agency Foundation & Business Model',
            'Module 2: Client Acquisition Strategies',
            'Module 3: Team Building & Management',
            'Module 4: Financial Optimization',
            'Module 5: Systems & Process Automation',
            'Module 6: Scaling to Seven Figures',
          ],
          prerequisites: ['Basic understanding of digital marketing', 'Some business experience preferred'],
        },
        '2': {
          id: '2',
          name: 'eCommerce Launchpad',
          code: 'ECM201',
          description: 'From zero to seven-figure store. Learn product research, marketing funnels, and scaling strategies that work.',
          enrolledAt: '2024-02-01',
          progress: 40,
          quizCount: 15,
          completedQuizzes: 6,
          averageScore: 82,
          duration: '12 weeks',
          modules: 8,
          lessons: 32,
          instructor: 'Sarah Williams',
          learningObjectives: [
            'Identify profitable products with high demand',
            'Validate market demand before launching',
            'Build high-converting sales funnels',
            'Optimize profit margins for sustainable growth',
            'Scale your store to seven-figure revenue',
            'Master Facebook and Google ads',
            'Build email marketing automation',
            'Create successful product launches',
          ],
          courseOutline: [
            'Module 1: Product Research & Selection',
            'Module 2: Market Validation Strategies',
            'Module 3: Supplier Relations & MOQ Optimization',
            'Module 4: Store Setup & Branding',
            'Module 5: Marketing Funnels & Ads',
            'Module 6: Conversion Optimization',
            'Module 7: Inventory & Fulfillment',
            'Module 8: Scaling & Automation',
          ],
          prerequisites: ['Basic understanding of online business', 'Capital for initial inventory'],
        },
        '3': {
          id: '3',
          name: 'Copywriting & Personal Branding',
          code: 'CPB301',
          description: 'Build your personal brand and master persuasive copywriting. Transform your voice into a business asset.',
          enrolledAt: '2024-02-15',
          progress: 25,
          quizCount: 10,
          completedQuizzes: 2,
          averageScore: 91,
          duration: '6 weeks',
          modules: 5,
          lessons: 20,
          instructor: 'Sarah Williams',
          learningObjectives: [
            'Write persuasive copy that converts',
            'Build a strong personal brand across platforms',
            'Understand your audience deeply',
            'Create content that builds trust and authority',
            'Leverage your personal brand for business growth',
            'Master social media content strategy',
            'Build an email list through content',
            'Monetize your personal brand',
          ],
          courseOutline: [
            'Module 1: Foundations of Persuasive Copywriting',
            'Module 2: Understanding Your Audience',
            'Module 3: Personal Brand Strategy',
            'Module 4: Content Creation & Distribution',
            'Module 5: Monetizing Your Personal Brand',
          ],
          prerequisites: ['None - open to all levels'],
        },
      };

      const courseData = mockCourses[courseId];
      if (!courseData) {
        router.push('/my-courses');
        return;
      }
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/my-courses');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
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

  if (loading || !course) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading program details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/my-courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {course.name}
              </h1>
              <p className="text-gray-600">{course.code} • Instructor: {course.instructor || 'TBA'}</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-6">{course.description}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Progress</p>
                  <p className="text-3xl font-bold">{course.progress}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100 mb-1">Avg Score</p>
                  <p className="text-3xl font-bold">{course.averageScore}%</p>
                </div>
                <Award className="w-10 h-10 text-green-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100 mb-1">Completed</p>
                  <p className="text-3xl font-bold">{course.completedQuizzes}/{course.quizCount}</p>
                </div>
                <FileQuestion className="w-10 h-10 text-purple-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100 mb-1">Enrolled</p>
                  <p className="text-sm font-bold">
                    {new Date(course.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-orange-200" />
              </div>
            </Card>
          </div>
        </div>

        {/* Progress Section */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-orbitron text-xl font-bold text-gray-900">Your Progress</h2>
              <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all ${getProgressColor(course.progress)}`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Modules Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.floor((course.progress / 100) * (course.modules || 0))}/{course.modules || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Lessons Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.floor((course.progress / 100) * (course.lessons || 0))}/{course.lessons || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Assessments</p>
                <p className="text-xl font-bold text-gray-900">{course.completedQuizzes}/{course.quizCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Average Score</p>
                <p className="text-xl font-bold text-gray-900">{course.averageScore}%</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Objectives */}
          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold text-gray-900">What You'll Learn</h2>
                </div>
                <ul className="space-y-3">
                  {course.learningObjectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {/* Course Information */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="font-orbitron text-xl font-bold text-gray-900">Course Information</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{course.duration || 'Self-paced'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Modules</p>
                    <p className="font-semibold text-gray-900">{course.modules || 'N/A'} modules</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Lessons</p>
                    <p className="font-semibold text-gray-900">{course.lessons || 'N/A'} lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileQuestion className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Assessments</p>
                    <p className="font-semibold text-gray-900">{course.quizCount} assessments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="font-semibold text-gray-900">{course.instructor || 'TBA'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Course Outline */}
        {course.courseOutline && course.courseOutline.length > 0 && (
          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <List className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="font-orbitron text-xl font-bold text-gray-900">Course Outline</h2>
              </div>
              <div className="space-y-4">
                {course.courseOutline.map((module, idx) => {
                  const moduleProgress = Math.floor((course.progress / 100) * course.courseOutline!.length);
                  const isCompleted = idx < moduleProgress;
                  
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : idx === moduleProgress
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? 'bg-green-600 text-white'
                              : idx === moduleProgress
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <span className="font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{module}</h3>
                            {isCompleted && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Completed
                              </span>
                            )}
                            {idx === moduleProgress && !isCompleted && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {idx === 0 && 'Foundation concepts and business model setup'}
                            {idx === 1 && 'Strategies for acquiring your first clients'}
                            {idx === 2 && 'Building and managing your team'}
                            {idx === 3 && 'Financial planning and optimization'}
                            {idx === 4 && 'Automation and systemization'}
                            {idx === 5 && 'Scaling strategies for growth'}
                            {idx === 6 && 'Advanced marketing and acquisition'}
                            {idx === 7 && 'Long-term sustainability and expansion'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="font-orbitron text-xl font-bold text-gray-900">Prerequisites</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Button onClick={() => router.push('/my-assessments')} className="flex-1">
            <FileQuestion className="w-4 h-4 mr-2" />
            View Assessments
          </Button>
          <Button onClick={() => router.push('/my-results')} variant="ghost" className="flex-1">
            <Award className="w-4 h-4 mr-2" />
            View Results
          </Button>
        </div>
      </main>
    </div>
  );
}

