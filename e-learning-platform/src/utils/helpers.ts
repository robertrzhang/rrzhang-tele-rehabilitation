import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE'); // Day of week
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
};

export const getAssignmentStatus = (dueDate: string, status: string) => {
  const due = new Date(dueDate);
  const now = new Date();
  
  if (status === 'submitted' || status === 'graded') {
    return status;
  }
  
  if (isPast(due)) {
    return 'overdue';
  }
  
  if (isToday(due)) {
    return 'due-today';
  }
  
  if (isThisWeek(due)) {
    return 'due-this-week';
  }
  
  return status;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'not-started':
      return 'bg-gray-100 text-gray-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'submitted':
      return 'bg-yellow-100 text-yellow-800';
    case 'graded':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'due-today':
      return 'bg-orange-100 text-orange-800';
    case 'due-this-week':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'programming':
      return 'bg-blue-100 text-blue-800';
    case 'design':
      return 'bg-purple-100 text-purple-800';
    case 'business':
      return 'bg-indigo-100 text-indigo-800';
    case 'data science':
      return 'bg-teal-100 text-teal-800';
    case 'marketing':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const generateCalendarData = (studySessions: any[]) => {
  const data: { [key: string]: number } = {};
  
  studySessions.forEach(session => {
    const date = format(new Date(session.date), 'yyyy-MM-dd');
    data[date] = (data[date] || 0) + session.duration;
  });
  
  return data;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
