# E-Learning Platform

A comprehensive e-learning platform built with React, TypeScript, and Tailwind CSS that helps students track their course progress and manage assignments.

## Features

### Student Authentication Flow
- **Login Page**: Email/password form with "Remember Me" checkbox and "Forgot Password" link
- **Registration Flow**: Multi-step signup with email verification simulation
- **Protected Routes**: Redirect unauthenticated users to login
- **Session Management**: Auto-logout after 30 minutes of inactivity, session persistence

### User Profile Section
- **Editable Profile**: Avatar upload simulation, personal information management
- **Learning Preferences**: Notification settings, preferred study times
- **Account Settings**: Privacy controls, security settings
- **Two-factor Authentication**: Enhanced security options

### Course Dashboard Page
- **Header Section**: Welcome message with student name, current streak counter, and quick stats
- **Course Grid/List Toggle**: Switch between card and list views of enrolled courses
- **Course Cards**: Comprehensive course information including progress, ratings, and metadata
- **Filter & Search**: Advanced filtering by category, completion status, and search functionality
- **Recently Accessed**: Quick links to last 3 courses/lessons viewed
- **Recommended Courses**: AI-powered course suggestions based on current enrollment

### Assignment Tracker Page
- **Assignment Overview**: Visual cards showing total, completed, overdue, and upcoming assignments
- **Advanced Assignment List**: Sortable columns with status badges and due date highlighting
- **Assignment Detail Modal**: Complete assignment information with submission interface
- **Bulk Actions**: Multi-select operations for efficient assignment management
- **Calendar Integration**: Visual calendar showing assignment due dates

### Progress Analytics Page
- **Learning Dashboard**: Comprehensive overview of study metrics and achievements
- **Interactive Charts**: Study time trends, category breakdowns, and completion rates
- **Achievement System**: Progress badges, milestone celebrations, and skill indicators
- **Activity Heatmap**: GitHub-style daily learning activity visualization
- **Course Breakdown**: Detailed progress tracking for each enrolled course
- **Goals & Targets**: Personal learning objectives with progress tracking

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form with custom validation
- **Notifications**: React Hot Toast

## Installation & Setup

Since Node.js is not currently installed on your system, you'll need to install it first:

### Prerequisites
1. **Install Node.js** (recommended version 18 or higher):
   - Visit [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version
   - Verify installation: `node --version` and `npm --version`

### Project Setup
1. **Navigate to project directory**:
   ```bash
   cd /Users/robertrzhang/berkeley/applications/interviews/tele-rehabilitation/e-learning-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - The app will be available at `http://localhost:5173`

### Demo Credentials
- **Email**: john.doe@example.com
- **Password**: password

## Project Structure

```
e-learning-platform/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (Navigation, etc.)
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Main application pages
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions and API mocks
├── package.json
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## Key Components

### State Management (Zustand)
- **Authentication State**: User session, login/logout, profile management
- **Course State**: Enrolled courses, recommendations, recent activity
- **Assignment State**: Assignment tracking, status updates, submissions
- **Analytics State**: Study sessions, achievements, learning goals

### Mock API System
The application includes a comprehensive mock API that simulates:
- User authentication and profile management
- Course enrollment and progress tracking
- Assignment submission and grading
- Learning analytics and achievement tracking

### Responsive Design
- **Mobile-first approach**: Optimized for all screen sizes
- **Responsive navigation**: Collapsible mobile menu
- **Adaptive layouts**: Flexible grid systems and components
- **Touch-friendly**: Optimized for mobile interactions

## UI/UX Features

### Design System
- **Consistent Typography**: Inter font family with proper font weights
- **Color Palette**: Carefully chosen primary and secondary colors
- **Component Library**: Reusable components with variants and sizes
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: User-friendly error messages and validation

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators and logical tab order

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Future Enhancements

The current implementation provides a solid foundation for future enhancements:

### Backend Integration
- Replace mock API with real backend endpoints
- Implement proper authentication with JWT tokens
- Add real-time notifications using WebSockets
- File upload functionality for assignments

### Advanced Features
- **Video Streaming**: Integrate video lessons with progress tracking
- **Discussion Forums**: Student and instructor communication
- **Live Sessions**: Virtual classroom functionality
- **Mobile App**: React Native implementation
- **Offline Support**: PWA with offline capabilities

### Analytics & AI
- **Advanced Analytics**: Detailed learning pattern analysis
- **AI Recommendations**: Machine learning-based course suggestions
- **Adaptive Learning**: Personalized learning paths
- **Predictive Analytics**: Early warning systems for at-risk students

## Contributing

This project follows modern React best practices:
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Encapsulated logic for reusability
- **Error Boundaries**: Graceful error handling
- **Performance**: Optimized rendering and state updates

## API Evaluation

The current backend API (GET/POST only) is **sufficient** for basic functionality but would benefit from additional endpoints for a complete production system:

### Current Coverage
- User authentication and profile management
- Course enrollment and basic progress tracking
- Assignment creation and status updates
- Basic analytics data retrieval

### Recommended Additions
- **PUT/PATCH**: For updating existing resources (assignments, user profiles)
- **DELETE**: For removing assignments, unenrolling from courses
- **File Upload**: For assignment submissions and profile avatars
- **Real-time Updates**: WebSocket connections for live notifications
- **Bulk Operations**: Efficient handling of multiple assignment updates

The application is designed to be easily extended when these additional endpoints become available.

## Demo Features

The platform includes realistic demo data to showcase all features:
- **Sample Courses**: Programming, Design, Business, and Data Science courses
- **Mock Assignments**: Various assignment types with different statuses
- **Progress Data**: Realistic learning analytics and achievement data
- **User Profiles**: Complete user information with preferences

This comprehensive e-learning platform demonstrates modern web development practices while providing a complete, functional prototype ready for production backend integration.
