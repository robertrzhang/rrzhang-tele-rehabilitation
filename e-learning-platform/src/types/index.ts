export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  enrolledCourses: string[];
  learningStreak: number;
  longestStreak: number; // Added this property
  totalHoursStudied: number;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    assignments: boolean;
    courseUpdates: boolean;
  };
  studyTimes: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  privacy: {
    profileVisible: boolean;
    progressVisible: boolean;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorRating: number;
  category: 'Programming' | 'Design' | 'Business' | 'Data Science' | 'Marketing';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
  estimatedHours: number;
  enrolled: boolean;
  progress: number; // 0-100
  lastAccessedAt?: string;
  createdAt: string;
  quizzes?: Quiz[]; // Added quiz property
}

export interface Quiz {
  id: string;
  title: string;
  score?: number; // 0-100
  maxScore: number;
  completedAt?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  points: number;
  maxPoints: number;
  grade?: number;
  submittedAt?: string;
  feedback?: string;
  rubricScores?: RubricScore[];
  attachments: string[];
  resources: Resource[];
}

export interface RubricScore {
  criterion: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'link' | 'quiz';
  url: string;
}

export interface StudySession {
  id: string;
  courseId: string;
  date: string;
  duration: number; // in minutes
  lessonsCompleted: number;
  quizScore?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'completion' | 'streak' | 'performance' | 'engagement';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  variant: 'gold' | 'silver' | 'bronze' | 'platinum' | 'diamond';
  unlockedAt?: string;
  progress?: number; // 0-100 for progress towards unlocking
  requirements?: {
    type: 'assignments' | 'hours' | 'courses' | 'streak';
    target: number;
    current: number;
  };
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  currentProgress: number;
  targetValue: number;
  unit: 'hours' | 'courses' | 'assignments';
  isCompleted: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CourseState {
  courses: Course[];
  enrolledCourses: Course[];
  recommendedCourses: Course[];
  recentlyAccessed: Course[];
  isLoading: boolean;
  error: string | null;
}

export interface AssignmentState {
  assignments: Assignment[];
  isLoading: boolean;
  error: string | null;
}

export interface AnalyticsState {
  studySessions: StudySession[];
  achievements: Achievement[];
  badges: Badge[];
  learningGoals: LearningGoal[];
  weeklyStats: {
    totalHours: number;
    completedCourses: number;
    averageQuizScore: number;
    currentStreak: number;
  };
  isLoading: boolean;
  error: string | null;
}
