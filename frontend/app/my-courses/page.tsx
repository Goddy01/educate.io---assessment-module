'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { BookOpen, Clock, FileQuestion, Award, TrendingUp, User, Target, List, CheckCircle, PlayCircle } from 'lucide-react';

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

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
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
      loadCourses();
    };

    checkAuth();
  }, [router]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // Mock data for enrolled courses
      const mockCourses: EnrolledCourse[] = [
        {
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
        {
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
        {
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
      ];
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
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

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        <div className="mb-6 md:mb-8">
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            My Programs
          </h1>
          <p className="text-gray-600">View your enrolled entrepreneurship programs and track your progress</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading programs...</p>
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No programs enrolled</h3>
              <p className="text-sm text-gray-500">
                You haven't enrolled in any programs yet. Contact your instructor to get started.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="font-orbitron text-xl font-bold text-gray-900">
                            {course.name}
                          </h2>
                          <p className="text-sm text-gray-500">{course.code}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 mt-3">{course.description}</p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FileQuestion className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">Assessments</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {course.completedQuizzes}/{course.quizCount}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">Avg Score</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{course.averageScore}%</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-purple-700 font-medium">Progress</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{course.progress}%</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-xs text-orange-700 font-medium">Enrolled</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(course.enrolledAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Program Details Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span><strong>Duration:</strong> {course.duration || 'Self-paced'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span><strong>Modules:</strong> {course.modules || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PlayCircle className="w-4 h-4 text-purple-600" />
                        <span><strong>Lessons:</strong> {course.lessons || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-green-600" />
                        <span><strong>Instructor:</strong> {course.instructor || 'TBA'}</span>
                      </div>
                    </div>

                    {course.learningObjectives && course.learningObjectives.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">What You'll Learn</h3>
                        </div>
                        <ul className="space-y-2">
                          {course.learningObjectives.map((objective, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {course.courseOutline && course.courseOutline.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <List className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900">Course Outline</h3>
                        </div>
                        <ul className="space-y-2">
                          {course.courseOutline.map((module, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="font-medium text-blue-600 flex-shrink-0">M{idx + 1}:</span>
                              <span>{module}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Prerequisites</h3>
                        <ul className="space-y-1">
                          {course.prerequisites.map((prereq, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-yellow-600">•</span>
                              <span>{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      onClick={() => router.push(`/my-courses/${course.id}`)}
                      variant="ghost"
                      className="w-full"
                    >
                      View Full Program Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

