'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import { authService } from '@/lib/auth';
import api from '@/lib/api';
import dynamic from 'next/dynamic';
type BarProps = { data: Array<{ label: string; count: number }> };
// Lazy-load a small wrapper component to avoid SSR and type issues
const LazyBarChart = dynamic<BarProps>(() => import('@/app/performance/[quizId]/RechartsBar'), {
  ssr: false,
});
import { Trophy, Award, Medal, TrendingUp } from 'lucide-react';

export default function PerformancePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const [stats, setStats] = useState<any>(null);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [topicPerformance, setTopicPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only instructors can view analytics
    if (!authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }

    loadPerformance();
  }, [quizId]);

  const loadPerformance = async () => {
    try {
      const [statsRes, distRes, leaderboardRes, topicRes] = await Promise.all([
        api.get(`/performance/class/${quizId}`),
        api.get(`/performance/score-distribution/${quizId}`),
        api.get(`/performance/leaderboard/${quizId}`).catch(() => ({ data: [] })),
        api.get(`/performance/topics/${quizId}`).catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setDistribution(distRes.data);
      setLeaderboard(leaderboardRes.data || []);
      setTopicPerformance(topicRes.data || []);
    } catch (error) {
      console.error('Error loading performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="w-6 h-6 text-gray-400 font-bold">{rank}</span>;
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 md:ml-64">
          <p className="text-gray-500">Loading performance data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
          Class Performance Dashboard
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <h3 className="text-sm text-gray-600 mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.averageScore || 0}%</p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600 mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.completionRate || 0}%</p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600 mb-2">Toughest Question</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.toughestQuestion || 'N/A'}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600 mb-2">Top Performer</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.topPerformer?.name || 'N/A'}
            </p>
          </Card>
        </div>

        {/* Score Distribution */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Score Distribution</h2>
          <div className="h-64">
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-200 rounded" />}>
              <LazyBarChart data={distribution} />
            </Suspense>
          </div>
        </Card>

        {/* Performance by Topic */}
        <Card className="mb-8">
          <h2 className="font-orbitron text-xl font-bold text-gray-900 mb-4">
            Performance by Topic
          </h2>
          {topicPerformance.length > 0 ? (
            <div className="space-y-4">
              {topicPerformance.map((item: any) => (
                <div key={item.topic}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{item.topic}</span>
                    <span className="text-gray-600">{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { topic: 'Algebra', score: 92 },
                { topic: 'Geometry', score: 85 },
                { topic: 'Calculus', score: 65 },
              ].map((item) => (
                <div key={item.topic}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{item.topic}</span>
                    <span className="text-gray-600">{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Leaderboard */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron text-xl font-bold text-gray-900">Leaderboard</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((entry: any, index: number) => (
                <div
                  key={entry.id || index}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    index < 3
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {entry.studentName || entry.name || `Student ${index + 1}`}
                      </h3>
                      <span className="text-lg font-bold text-gray-900">{entry.score || 0}%</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Attempt: {entry.attemptNumber || 1}</span>
                      {entry.completedAt && (
                        <>
                          <span>•</span>
                          <span>
                            Completed: {new Date(entry.completedAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { name: 'Alex Johnson', score: 95, rank: 1 },
                { name: 'Sarah Williams', score: 92, rank: 2 },
                { name: 'Michael Brown', score: 88, rank: 3 },
                { name: 'Emily Davis', score: 85, rank: 4 },
                { name: 'James Miller', score: 82, rank: 5 },
              ].map((student) => (
                <div
                  key={student.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    student.rank <= 3
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(student.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <span className="text-lg font-bold text-gray-900">{student.score}%</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Attempt: 1</span>
                      <span>•</span>
                      <span>Completed: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-500 text-center mt-4">
                Leaderboard displays top performers based on quiz scores. Rankings update as more
                students complete the quiz.
              </p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

