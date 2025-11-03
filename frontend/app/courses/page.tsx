'use client';

import { useEffect, useState, useDeferredValue, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { authService } from '@/lib/auth';
import { Plus, BookOpen, Users, Calendar, Search, Clock, User, Target, List, CheckCircle, PlayCircle } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  studentCount: number;
  quizCount: number;
  createdAt: string;
  duration?: string;
  modules?: number;
  lessons?: number;
  instructor?: string;
  learningObjectives?: string[];
  courseOutline?: string[];
  prerequisites?: string[];
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only instructors can view/manage programs
    if (!authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }

    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // Mock data for demo - in production, this would fetch from API
      const mockCourses: Course[] = [
        {
          id: '1',
          name: 'Agency Growth Mastery',
          code: 'AGM101',
          description: 'Master the fundamentals of building and scaling a digital agency. Learn client acquisition, team building, and profit optimization.',
          studentCount: 1247,
          quizCount: 12,
          createdAt: '2024-01-15',
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
          studentCount: 892,
          quizCount: 15,
          createdAt: '2024-01-20',
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
          studentCount: 634,
          quizCount: 10,
          createdAt: '2024-02-01',
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
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const term = deferredSearch.toLowerCase();
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term),
    );
  }, [courses, deferredSearch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-blue-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900">
                Programs
              </h1>
              <p className="text-gray-600 mt-1">World-class entrepreneurship education programs</p>
            </div>
            <Button
              onClick={() => {
                alert('Create program functionality would be implemented here');
              }}
              className="flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Program
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Programs List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading programs...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6 text-lg">
              {search ? 'No programs found' : 'No programs yet'}
            </p>
            <Button
              onClick={() => {
                alert('Create program functionality would be implemented here');
              }}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Program
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => {
              const gradients = [
                'from-blue-500 via-blue-600 to-indigo-600',
                'from-purple-500 via-purple-600 to-pink-600',
                'from-emerald-500 via-green-600 to-teal-600',
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <Card 
                  key={course.id} 
                  className="group relative overflow-hidden cursor-pointer border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    alert(`Course details for ${course.name} would be shown here`);
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 bg-gradient-to-r ${gradient} text-white rounded-lg text-xs font-bold shadow-md`}>
                            {course.code}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">{course.name}</h2>
                        {course.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-100 transition-colors">
                            {course.description}
                          </p>
                        )}

                        {/* Program Details Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {course.duration && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-200 transition-colors">
                              <Clock className="w-3 h-3 text-orange-600 group-hover:text-orange-300" />
                              <span><strong>Duration:</strong> {course.duration}</span>
                            </div>
                          )}
                          {course.modules && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-200 transition-colors">
                              <BookOpen className="w-3 h-3 text-blue-600 group-hover:text-blue-300" />
                              <span><strong>Modules:</strong> {course.modules}</span>
                            </div>
                          )}
                          {course.lessons && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-200 transition-colors">
                              <PlayCircle className="w-3 h-3 text-purple-600 group-hover:text-purple-300" />
                              <span><strong>Lessons:</strong> {course.lessons}</span>
                            </div>
                          )}
                          {course.instructor && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-200 transition-colors">
                              <User className="w-3 h-3 text-green-600 group-hover:text-green-300" />
                              <span><strong>Instructor:</strong> {course.instructor}</span>
                            </div>
                          )}
                        </div>

                        {/* Learning Objectives Preview */}
                        {course.learningObjectives && course.learningObjectives.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-blue-600 group-hover:text-blue-300" />
                              <h4 className="text-xs font-semibold text-gray-900 group-hover:text-white transition-colors">What You'll Learn:</h4>
                            </div>
                            <ul className="space-y-1">
                              {course.learningObjectives.slice(0, 3).map((objective, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 group-hover:text-gray-200 transition-colors">
                                  <CheckCircle className="w-3 h-3 text-green-600 group-hover:text-green-300 flex-shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{objective}</span>
                                </li>
                              ))}
                              {course.learningObjectives.length > 3 && (
                                <li className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                  +{course.learningObjectives.length - 3} more objectives
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200 group-hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                        <div className="w-8 h-8 bg-blue-100 group-hover:bg-white group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-colors">
                          <Users className="w-4 h-4 text-blue-600 group-hover:text-white" />
                        </div>
                        <span className="font-semibold">{course.studentCount.toLocaleString()} entrepreneurs</span>
                      </div>
                      <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                        <div className="w-8 h-8 bg-purple-100 group-hover:bg-white group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-colors">
                          <BookOpen className="w-4 h-4 text-purple-600 group-hover:text-white" />
                        </div>
                        <span className="font-semibold">{course.quizCount} assessments</span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 group-hover:text-gray-200 transition-colors flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {formatDate(course.createdAt)}</span>
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

