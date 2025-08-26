import { User, Course, Assignment, StudySession, Achievement, Badge, LearningGoal } from '../types';

// Mock data
const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  enrolledCourses: ['1', '2', '3'],
  learningStreak: 7,
  longestStreak: 23,
  totalHoursStudied: 45,
  preferences: {
    notifications: {
      email: true,
      push: false,
      assignments: true,
      courseUpdates: true,
    },
    studyTimes: {
      morning: true,
      afternoon: false,
      evening: true,
    },
    privacy: {
      profileVisible: true,
      progressVisible: false,
    },
  },
  createdAt: '2024-01-15T00:00:00Z',
  lastLoginAt: '2025-08-23T10:00:00Z',
};

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    instructor: 'Sarah Johnson',
    instructorRating: 4.8,
    category: 'Programming',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
    totalLessons: 12,
    completedLessons: 7,
    estimatedHours: 8,
    enrolled: true,
    progress: 58,
    lastAccessedAt: '2025-08-22T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'UI/UX Design Principles',
    description: 'Master the art of user interface and experience design',
    instructor: 'Michael Chen',
    instructorRating: 4.6,
    category: 'Design',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop',
    totalLessons: 15,
    completedLessons: 3,
    estimatedHours: 12,
    enrolled: true,
    progress: 20,
    lastAccessedAt: '2025-08-21T16:45:00Z',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Business Strategy',
    description: 'Learn strategic thinking for business success',
    instructor: 'Emma Wilson',
    instructorRating: 4.9,
    category: 'Business',
    difficulty: 'Advanced',
    thumbnail: 'https://img-cdn.inc.com/image/upload/f_webp,c_fit,w_1920,q_auto/images/panoramic/getty_180152187_970679970450042_64007.jpg?w=300&h=200&fit=crop',
    totalLessons: 20,
    completedLessons: 12,
    estimatedHours: 15,
    enrolled: true,
    progress: 60,
    lastAccessedAt: '2025-08-20T09:15:00Z',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'Python for Data Science',
    description: 'Use Python for data analysis and machine learning',
    instructor: 'David Park',
    instructorRating: 4.7,
    category: 'Data Science',
    difficulty: 'Intermediate',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFpE_CJvPxG2BqjyCT73AxhEq5wEUOGVViIg&s?w=300&h=200&fit=crop',
    totalLessons: 18,
    completedLessons: 0,
    estimatedHours: 20,
    enrolled: false,
    progress: 0,
    createdAt: '2024-04-01T00:00:00Z',
  },
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'React Fundamentals',
    title: 'Build a Todo App',
    description: 'Create a fully functional todo application using React hooks',
    dueDate: '2025-09-01T23:59:59Z',
    status: 'in-progress',
    points: 85,
    maxPoints: 100,
    attachments: [],
    resources: [
      {
        id: '1',
        title: 'React Hooks Documentation',
        type: 'link',
        url: 'https://react.dev/reference/react'
      }
    ],
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'UI/UX Design Principles',
    title: 'Design System Creation',
    description: 'Create a comprehensive design system for a mobile app',
    dueDate: '2025-08-25T23:59:59Z',
    status: 'not-started',
    points: 0,
    maxPoints: 100,
    attachments: [],
    resources: [],
  },
  {
    id: '3',
    courseId: '1',
    courseName: 'React Fundamentals',
    title: 'Component Library',
    description: 'Build reusable React components',
    dueDate: '2025-08-24T23:59:59Z',
    status: 'submitted',
    points: 92,
    maxPoints: 100,
    submittedAt: '2025-08-23T15:30:00Z',
    feedback: 'Excellent work! Clean code and good component structure.',
    attachments: ['component-library.zip'],
    resources: [],
  },
  {
    id: '4',
    courseId: '3',
    courseName: 'Business Strategy',
    title: 'Market Analysis Report',
    description: 'Analyze market trends and competitive landscape',
    dueDate: '2025-08-20T23:59:59Z',
    status: 'graded',
    points: 88,
    maxPoints: 100,
    grade: 88,
    submittedAt: '2025-08-19T18:45:00Z',
    feedback: 'Good analysis, but could use more specific data points.',
    rubricScores: [
      {
        criterion: 'Research Quality',
        score: 18,
        maxScore: 20,
        feedback: 'Solid research with credible sources'
      },
      {
        criterion: 'Analysis Depth',
        score: 35,
        maxScore: 40,
        feedback: 'Good insights but could go deeper'
      }
    ],
    attachments: ['market-analysis.pdf'],
    resources: [],
  },
];

const mockStudySessions: StudySession[] = [
  { id: '1', courseId: '1', date: '2025-08-23', duration: 45, lessonsCompleted: 1, quizScore: 85 },
  { id: '2', courseId: '2', date: '2025-08-22', duration: 30, lessonsCompleted: 1 },
  { id: '3', courseId: '1', date: '2025-08-21', duration: 60, lessonsCompleted: 2, quizScore: 92 },
  { id: '4', courseId: '3', date: '2025-08-20', duration: 90, lessonsCompleted: 1, quizScore: 78 },
];

const mockBadges: Badge[] = [
  {
    id: '1',
    title: 'Course Master',
    description: 'Complete 5 courses with 90%+ average',
    icon: '🏆',
    variant: 'gold',
    unlockedAt: '2025-08-15T00:00:00Z',
    progress: 100,
    requirements: {
      type: 'courses',
      target: 5,
      current: 5,
    },
  },
  {
    id: '2',
    title: 'Study Streak Champion',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥',
    variant: 'platinum',
    progress: 77,
    requirements: {
      type: 'streak',
      target: 30,
      current: 23,
    },
  },
  {
    id: '3',
    title: 'Assignment Ace',
    description: 'Submit 25 assignments on time',
    icon: '📝',
    variant: 'silver',
    unlockedAt: '2025-08-10T00:00:00Z',
    progress: 100,
    requirements: {
      type: 'assignments',
      target: 25,
      current: 25,
    },
  },
  {
    id: '4',
    title: 'Study Marathon',
    description: 'Study for 100+ hours total',
    icon: '⏰',
    variant: 'bronze',
    progress: 85,
    requirements: {
      type: 'hours',
      target: 100,
      current: 85,
    },
  },
  {
    id: '5',
    title: 'Perfect Score Legend',
    description: 'Achieve 100% on 10 assignments',
    icon: '💎',
    variant: 'diamond',
    progress: 40,
    requirements: {
      type: 'assignments',
      target: 10,
      current: 4,
    },
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Course Completed',
    description: 'Completed your first course',
    icon: '🎓',
    unlockedAt: '2025-08-15T00:00:00Z',
    category: 'completion',
  },
  {
    id: '2',
    title: '7-Day Streak',
    description: 'Studied for 7 consecutive days',
    icon: '🔥',
    unlockedAt: '2025-08-23T00:00:00Z',
    category: 'streak',
  },
  {
    id: '3',
    title: 'High Scorer',
    description: 'Achieved 90%+ on 5 quizzes',
    icon: '⭐',
    unlockedAt: '2025-08-20T00:00:00Z',
    category: 'performance',
  },
];

const mockLearningGoals: LearningGoal[] = [
  {
    id: '1',
    title: 'Complete 3 Courses',
    description: 'Finish 3 courses by the end of the month',
    targetDate: '2025-08-31T23:59:59Z',
    currentProgress: 1,
    targetValue: 3,
    unit: 'courses',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Study 50 Hours',
    description: 'Accumulate 50 hours of study time',
    targetDate: '2025-09-30T23:59:59Z',
    currentProgress: 45,
    targetValue: 50,
    unit: 'hours',
    isCompleted: false,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const apiGet = async (endpoint: string): Promise<any> => {
  await delay(500); // Simulate network delay
  
  switch (endpoint) {
    case '/auth/me':
      return mockUser;
    
    case '/courses':
      return mockCourses;
    
    case '/courses/enrolled':
      return mockCourses.filter(course => course.enrolled);
    
    case '/courses/recommended':
      return mockCourses.filter(course => !course.enrolled);
    
    case '/courses/recent':
      return mockCourses
        .filter(course => course.enrolled && course.lastAccessedAt)
        .sort((a, b) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime())
        .slice(0, 3);
    
    case '/assignments':
      return mockAssignments;
    
    case '/analytics/sessions':
      return mockStudySessions;
    
    case '/analytics/achievements':
      return mockAchievements;
    
    case '/analytics/badges':
      return mockBadges;
    
    case '/analytics/goals':
      return mockLearningGoals;
    
    case '/analytics/weekly-stats':
      return {
        totalHours: 15.5,
        completedCourses: 1,
        averageQuizScore: 85,
        currentStreak: 7,
      };
    
    default:
      // Handle email verification with query parameters
      if (endpoint.startsWith('/auth/verify-email?token=')) {
        const urlParams = new URLSearchParams(endpoint.split('?')[1]);
        const token = urlParams.get('token');
        
        if (token === 'expired-token') {
          throw new Error('Verification link has expired');
        } else if (token?.startsWith('mock-verification-')) {
          return { success: true, message: 'Email verified successfully' };
        } else {
          throw new Error('Invalid verification token');
        }
      }
      
      throw new Error(`Endpoint ${endpoint} not found`);
  }
};

export const apiPost = async (endpoint: string, data: any): Promise<any> => {
  await delay(300);
  
  switch (endpoint) {
    case '/auth/login':
      if (data.email === 'john.doe@example.com' && data.password === 'password') {
        return { user: mockUser, token: 'mock-jwt-token' };
      } else {
        throw new Error('Invalid credentials');
      }
    
    case '/auth/register':
      return { 
        user: { ...mockUser, email: data.email, firstName: data.firstName, lastName: data.lastName },
        token: 'mock-jwt-token'
      };
    
    case '/auth/logout':
      return { success: true };
    
    case '/auth/forgot-password':
      return { success: true, message: 'Password reset email sent' };
    
    case '/auth/change-password':
      return { success: true, message: 'Password updated successfully' };
    
    case '/auth/send-verification-code':
      return { success: true, message: 'Verification code sent' };
    
    case '/auth/verify-code':
      if (data.code === '123456') {
        return { 
          success: true, 
          message: 'Email verified successfully',
          user: { ...mockUser, email: data.email },
          token: 'mock-jwt-token-verified'
        };
      } else {
        throw new Error('Invalid verification code');
      }
    
    case '/auth/verify-email':
      return { success: true, message: 'Email verification sent' };
    
    case '/auth/resend-verification':
      return { success: true, message: 'Verification email resent' };
    
    case '/assignments':
      const newAssignment = {
        ...data,
        id: Date.now().toString(),
        status: 'not-started',
        points: 0,
        attachments: [],
        resources: [],
      };
      return newAssignment;
    
    case '/user/preferences':
      return { ...mockUser, preferences: data };
    
    default:
      throw new Error(`Endpoint ${endpoint} not found`);
  }
};

export const apiPut = async (endpoint: string, data: any): Promise<any> => {
  await delay(300);
  
  if (endpoint.startsWith('/assignments/')) {
    const assignmentId = endpoint.split('/')[2];
    const assignment = mockAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      return { ...assignment, ...data };
    }
  }
  
  if (endpoint === '/user/profile') {
    return { ...mockUser, ...data };
  }
  
  throw new Error(`Endpoint ${endpoint} not found`);
};

export const apiDelete = async (endpoint: string): Promise<any> => {
  await delay(300);
  
  if (endpoint.startsWith('/assignments/')) {
    return { success: true };
  }
  
  throw new Error(`Endpoint ${endpoint} not found`);
};
