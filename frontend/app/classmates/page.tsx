'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import { authService } from '@/lib/auth';
import { Users, Award, TrendingUp, BookOpen } from 'lucide-react';

interface Classmate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrolledCourses: number;
  completedAssessments: number;
  averageScore: number;
  rank: number;
  avatar?: string;
}

export default function ClassmatesPage() {
  const router = useRouter();
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [search, setSearch] = useState('');
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

      // Only students can view classmates
      if (authService.isInstructor()) {
        router.replace('/dashboard');
        return;
      }

      setCheckingAuth(false);
      loadClassmates();
    };

    checkAuth();
  }, [router]);

  const loadClassmates = async () => {
    try {
      setLoading(true);
      // Mock data for classmates
      const mockClassmates: Classmate[] = [
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@demo.com',
          enrolledCourses: 3,
          completedAssessments: 15,
          averageScore: 94,
          rank: 1,
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@demo.com',
          enrolledCourses: 4,
          completedAssessments: 18,
          averageScore: 89,
          rank: 2,
        },
        {
          id: '3',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@demo.com',
          enrolledCourses: 2,
          completedAssessments: 12,
          averageScore: 87,
          rank: 3,
        },
        {
          id: '4',
          firstName: 'David',
          lastName: 'Martinez',
          email: 'david.martinez@demo.com',
          enrolledCourses: 3,
          completedAssessments: 14,
          averageScore: 85,
          rank: 4,
        },
        {
          id: '5',
          firstName: 'Jessica',
          lastName: 'Taylor',
          email: 'jessica.taylor@demo.com',
          enrolledCourses: 2,
          completedAssessments: 10,
          averageScore: 83,
          rank: 5,
        },
        {
          id: '6',
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'student@demo.com',
          enrolledCourses: 3,
          completedAssessments: 5,
          averageScore: 87,
          rank: 6,
        },
      ];

      setClassmates(mockClassmates);
    } catch (error) {
      console.error('Error loading classmates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClassmates = classmates.filter(
    (classmate) =>
      classmate.firstName.toLowerCase().includes(search.toLowerCase()) ||
      classmate.lastName.toLowerCase().includes(search.toLowerCase()) ||
      classmate.email.toLowerCase().includes(search.toLowerCase()),
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
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
            Classmates
          </h1>
          <p className="text-gray-600">View your fellow entrepreneurs and their progress</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search classmates by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading classmates...</p>
          </div>
        ) : filteredClassmates.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No classmates found</h3>
              <p className="text-sm text-gray-500">
                {search ? 'Try a different search term.' : 'No classmates enrolled yet.'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassmates.map((classmate) => (
              <Card key={classmate.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {classmate.firstName[0]}{classmate.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {classmate.firstName} {classmate.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">{classmate.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {getRankBadge(classmate.rank)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-blue-700 font-medium mb-1">Courses</p>
                      <p className="text-lg font-bold text-gray-900">{classmate.enrolledCourses}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-700 font-medium mb-1">Completed</p>
                      <p className="text-lg font-bold text-gray-900">
                        {classmate.completedAssessments}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-purple-700 font-medium mb-1">Avg Score</p>
                      <p className={`text-lg font-bold ${getScoreColor(classmate.averageScore)}`}>
                        {classmate.averageScore}%
                      </p>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Overall Progress</span>
                      <span className="text-xs font-semibold text-gray-900">
                        {Math.round((classmate.completedAssessments / (classmate.enrolledCourses * 10)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((classmate.completedAssessments / (classmate.enrolledCourses * 10)) * 100, 100)}%`,
                        }}
                      />
                    </div>
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

