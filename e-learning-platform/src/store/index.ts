import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, CourseState, AssignmentState, AnalyticsState } from '../types';
import { apiGet, apiPost, apiPut } from '../utils/api';

interface AppState extends AuthState, CourseState, AssignmentState, AnalyticsState {
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  
  // Course actions
  loadCourses: () => Promise<void>;
  loadEnrolledCourses: () => Promise<void>;
  loadRecommendedCourses: () => Promise<void>;
  loadRecentlyAccessed: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  
  // Assignment actions
  loadAssignments: () => Promise<void>;
  submitAssignment: (assignmentId: string, files: File[]) => Promise<void>;
  updateAssignmentStatus: (assignmentId: string, status: string) => Promise<void>;
  
  // Analytics actions
  loadAnalytics: () => Promise<void>;
  loadStudySessions: () => Promise<void>;
  loadAchievements: () => Promise<void>;
  loadBadges: () => Promise<void>;
  loadLearningGoals: () => Promise<void>;
  loadWeeklyStats: () => Promise<void>;
}

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      courses: [],
      enrolledCourses: [],
      recommendedCourses: [],
      recentlyAccessed: [],
      assignments: [],
      studySessions: [],
      achievements: [],
      badges: [],
      learningGoals: [],
      weeklyStats: {
        totalHours: 0,
        completedCourses: 0,
        averageQuizScore: 0,
        currentStreak: 0,
      },

      // Auth actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPost('/auth/login', { email, password });
          localStorage.setItem('token', response.token);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPost('/auth/register', { 
            email, 
            password, 
            firstName, 
            lastName 
          });
          // Don't auto-login after registration - user needs to verify email first
          set({ 
            isLoading: false 
          });
          return response; // Return response for the component to handle
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      verifyEmail: async (email: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPost('/auth/verify-code', { email, code });
          localStorage.setItem('token', response.token);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Email verification failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          isAuthenticated: false, 
          courses: [], 
          enrolledCourses: [], 
          assignments: [] 
        });
      },

      loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        set({ isLoading: true });
        try {
          const user = await apiGet('/auth/me');
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          localStorage.removeItem('token');
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load user', 
            isLoading: false 
          });
        }
      },

      updateUserProfile: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await apiPut('/user/profile', data);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile', 
            isLoading: false 
          });
        }
      },

      // Course actions
      loadCourses: async () => {
        set({ isLoading: true, error: null });
        try {
          const courses = await apiGet('/courses');
          set({ courses, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load courses', 
            isLoading: false 
          });
        }
      },

      loadEnrolledCourses: async () => {
        try {
          const enrolledCourses = await apiGet('/courses/enrolled');
          set({ enrolledCourses });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load enrolled courses' });
        }
      },

      loadRecommendedCourses: async () => {
        try {
          const recommendedCourses = await apiGet('/courses/recommended');
          set({ recommendedCourses });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load recommended courses' });
        }
      },

      loadRecentlyAccessed: async () => {
        try {
          const recentlyAccessed = await apiGet('/courses/recent');
          set({ recentlyAccessed });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load recent courses' });
        }
      },

      enrollInCourse: async (courseId: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiPost('/courses/enroll', { courseId });
          // Reload courses after enrollment
          get().loadEnrolledCourses();
          get().loadRecommendedCourses();
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to enroll in course', 
            isLoading: false 
          });
        }
      },

      // Assignment actions
      loadAssignments: async () => {
        set({ isLoading: true, error: null });
        try {
          const assignments = await apiGet('/assignments');
          set({ assignments, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load assignments', 
            isLoading: false 
          });
        }
      },

      submitAssignment: async (assignmentId: string, files: File[]) => {
        set({ isLoading: true, error: null });
        try {
          await apiPut(`/assignments/${assignmentId}`, { 
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            attachments: files.map(f => f.name)
          });
          // Reload assignments
          get().loadAssignments();
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to submit assignment', 
            isLoading: false 
          });
        }
      },

      updateAssignmentStatus: async (assignmentId: string, status: string) => {
        try {
          await apiPut(`/assignments/${assignmentId}`, { status });
          // Update local state
          const assignments = get().assignments.map(assignment =>
            assignment.id === assignmentId ? { ...assignment, status: status as any } : assignment
          );
          set({ assignments });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update assignment' });
        }
      },

      // Analytics actions
      loadAnalytics: async () => {
        await Promise.all([
          get().loadStudySessions(),
          get().loadAchievements(),
          get().loadBadges(),
          get().loadLearningGoals(),
          get().loadWeeklyStats(),
        ]);
      },

      loadStudySessions: async () => {
        try {
          const studySessions = await apiGet('/analytics/sessions');
          set({ studySessions });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load study sessions' });
        }
      },

      loadAchievements: async () => {
        try {
          const achievements = await apiGet('/analytics/achievements');
          set({ achievements });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load achievements' });
        }
      },

      loadBadges: async () => {
        try {
          const badges = await apiGet('/analytics/badges');
          set({ badges });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load badges' });
        }
      },

      loadLearningGoals: async () => {
        try {
          const learningGoals = await apiGet('/analytics/goals');
          set({ learningGoals });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load learning goals' });
        }
      },

      loadWeeklyStats: async () => {
        try {
          const weeklyStats = await apiGet('/analytics/weekly-stats');
          set({ weeklyStats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load weekly stats' });
        }
      },
    }),
    {
      name: 'e-learning-store',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useStore;
