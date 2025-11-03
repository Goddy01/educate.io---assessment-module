'use client';

import { useEffect, useState, useDeferredValue, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { authService } from '@/lib/auth';
import { Plus, Users, Mail, GraduationCap, Search, Filter, X } from 'lucide-react';
import { toast } from '@/lib/toast';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseCount: number;
  quizCount: number;
  averageScore: number;
  enrolledAt: string;
  status: 'active' | 'inactive';
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    selectedPrograms: [] as string[],
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Only instructors can manage students
    if (!authService.isInstructor()) {
      router.push('/dashboard');
      return;
    }

    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      const mockStudents: Student[] = [
        {
          id: '1',
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex.johnson@student.demo',
          courseCount: 3,
          quizCount: 12,
          averageScore: 87,
          enrolledAt: '2024-01-10',
          status: 'active',
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@student.demo',
          courseCount: 2,
          quizCount: 8,
          averageScore: 92,
          enrolledAt: '2024-01-15',
          status: 'active',
        },
        {
          id: '3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@student.demo',
          courseCount: 4,
          quizCount: 15,
          averageScore: 78,
          enrolledAt: '2024-01-08',
          status: 'active',
        },
        {
          id: '4',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@student.demo',
          courseCount: 1,
          quizCount: 4,
          averageScore: 85,
          enrolledAt: '2024-02-01',
          status: 'active',
        },
        {
          id: '5',
          firstName: 'James',
          lastName: 'Miller',
          email: 'james.miller@student.demo',
          courseCount: 2,
          quizCount: 6,
          averageScore: 75,
          enrolledAt: '2023-12-20',
          status: 'inactive',
        },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const term = deferredSearch.toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term);
      const matchesFilter = filter === 'all' || student.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [students, deferredSearch, filter]);

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const handleAddEntrepreneur = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if email already exists
    if (students.some((s) => s.email === formData.email)) {
      toast.warning('An entrepreneur with this email already exists');
      return;
    }

    // Create new entrepreneur
    const newStudent: Student = {
      id: String(Date.now()),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      courseCount: formData.selectedPrograms.length,
      quizCount: 0,
      averageScore: 0,
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setStudents([...students, newStudent]);
    setFormData({ firstName: '', lastName: '', email: '', selectedPrograms: [] });
    setShowAddModal(false);
    toast.success(`${newStudent.firstName} ${newStudent.lastName} has been added successfully!`);
  };

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === 'active').length,
    inactive: students.filter((s) => s.status === 'inactive').length,
    averageScore: Math.round(
      students.reduce((sum, s) => sum + s.averageScore, 0) / students.length,
    ),
  };

  // Mock programs for enrollment selection
  const availablePrograms = [
    { id: '1', name: 'Agency Growth Mastery', code: 'AGM101' },
    { id: '2', name: 'eCommerce Launchpad', code: 'ECM201' },
    { id: '3', name: 'Copywriting & Personal Branding', code: 'CPB301' },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-blue-50/20 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900">
                Entrepreneurs
              </h1>
              <p className="text-gray-600 mt-1">Empowering the next generation of entrepreneurs</p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Entrepreneur
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-2">Total Entrepreneurs</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100 mb-2">Active</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-100 mb-2">Inactive</p>
                  <p className="text-3xl font-bold">{stats.inactive}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-violet-100 mb-2">Average Score</p>
                  <p className="text-3xl font-bold">{stats.averageScore}%</p>
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
                placeholder="Search entrepreneurs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'inactive'] as const).map((status) => (
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

        {/* Students List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6 text-lg">
              {search ? 'No entrepreneurs found' : 'No entrepreneurs yet'}
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Your First Entrepreneur
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-xs">{student.email}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      student.status,
                    )}`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Programs</span>
                    <span className="font-medium text-gray-900">{student.courseCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Assessments Taken</span>
                    <span className="font-medium text-gray-900">{student.quizCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Average Score</span>
                    <span className={`font-bold ${getScoreColor(student.averageScore)}`}>
                      {student.averageScore}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Entrepreneur Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ firstName: '', lastName: '', email: '', selectedPrograms: [] });
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <h2 className="font-orbitron text-2xl font-bold text-gray-900 mb-2">
                  Add New Entrepreneur
                </h2>
                <p className="text-gray-600">
                  Add a new entrepreneur to your platform and enroll them in programs
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddEntrepreneur();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="John"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john.doe@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enroll in Programs (Optional)
                  </label>
                  <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {availablePrograms.map((program) => (
                      <label
                        key={program.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedPrograms.includes(program.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedPrograms: [...formData.selectedPrograms, program.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedPrograms: formData.selectedPrograms.filter(
                                  (id) => id !== program.id,
                                ),
                              });
                            }
                          }}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{program.name}</div>
                          <div className="text-sm text-gray-500">{program.code}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {availablePrograms.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No programs available. Create a program first.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ firstName: '', lastName: '', email: '', selectedPrograms: [] });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Add Entrepreneur
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

