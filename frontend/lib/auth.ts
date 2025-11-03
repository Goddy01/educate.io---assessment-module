// Static demo users for demonstration purposes
const STATIC_USERS = {
  student: {
    id: 'student-demo-001',
    email: 'student@demo.com',
    password: 'demo123',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: 'student',
  },
  teacher: {
    id: 'teacher-demo-001',
    email: 'teacher@demo.com',
    password: 'demo123',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'instructor',
  },
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

export interface LoginResponse {
  access_token: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Generate a simple mock token
const generateMockToken = (userId: string): string => {
  const payload = { id: userId, timestamp: Date.now() };
  return `mock_token_${btoa(JSON.stringify(payload))}`;
};

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check static credentials
    let user = null;
    if (
      email === STATIC_USERS.student.email &&
      password === STATIC_USERS.student.password
    ) {
      user = STATIC_USERS.student;
    } else if (
      email === STATIC_USERS.teacher.email &&
      password === STATIC_USERS.teacher.password
    ) {
      user = STATIC_USERS.teacher;
    }

    if (!user) {
      throw new Error('Invalid email or password. Use demo credentials: student@demo.com or teacher@demo.com with password: demo123');
    }

    const access_token = generateMockToken(user.id);
    const response: LoginResponse = {
      access_token,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(response));

    return response;
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string,
  ): Promise<LoginResponse> => {
    // For demo purposes, registration is disabled - use static accounts
    throw new Error('Registration is disabled for demo. Please use the provided demo accounts: student@demo.com or teacher@demo.com with password: demo123');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  isInstructor: function (): boolean {
    if (typeof window === 'undefined') return false;
    const user = this.getCurrentUser();
    if (user === null || user === undefined) return false;
    return user.role === 'instructor' || user.role === 'teacher';
  },

  isStudent: function (): boolean {
    if (typeof window === 'undefined') return false;
    const user = this.getCurrentUser();
    if (user === null || user === undefined) return false;
    return user.role === 'student';
  },
};

