import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, Badge, Progress, LoadingSpinner } from '../components/ui';
import useStore from '../store';

// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ProgressAnalytics: React.FC = () => {
  const {
    studySessions,
    achievements,
    learningGoals,
    weeklyStats,
    enrolledCourses,
    isLoading,
    loadAnalytics,
  } = useStore();

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Prepare chart data
  const studyTimeData = studySessions
    .slice(-30)
    .map(session => ({
      date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration: session.duration,
    }));

  const categoryData = enrolledCourses.reduce((acc, course) => {
    const existing = acc.find(item => item.category === course.category);
    if (existing) {
      existing.hours += course.completedLessons * 0.5; // Estimate 30 min per lesson
    } else {
      acc.push({
        category: course.category,
        hours: course.completedLessons * 0.5,
      });
    }
    return acc;
  }, [] as any[]);

  const completionData = [
    { name: 'Completed', value: enrolledCourses.filter(c => c.progress === 100).length, color: '#10B981' },
    { name: 'In Progress', value: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length, color: '#3B82F6' },
    { name: 'Not Started', value: enrolledCourses.filter(c => c.progress === 0).length, color: '#6B7280' },
  ];

  // Calendar heatmap data (simplified)
  const calendarData = studySessions.reduce((acc, session) => {
    const date = session.date;
    acc[date] = (acc[date] || 0) + session.duration;
    return acc;
  }, {} as any);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-secondary-900">Progress Analytics</h1>
          <p className="text-secondary-600 mt-1">Track your learning progress and achievements</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Learning Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-600">{weeklyStats.totalHours}</div>
            <div className="text-sm text-secondary-600">Hours This Week</div>
            <div className="text-xs text-secondary-500 mt-1">+2.5h from last week</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">{weeklyStats.completedCourses}</div>
            <div className="text-sm text-secondary-600">Courses Completed</div>
            <div className="text-xs text-secondary-500 mt-1">This month</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">{weeklyStats.averageQuizScore}%</div>
            <div className="text-sm text-secondary-600">Average Quiz Score</div>
            <div className="text-xs text-secondary-500 mt-1">+3% improvement</div>
          </Card>
          <Card className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-3xl font-bold text-orange-600">{weeklyStats.currentStreak}</span>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-sm text-secondary-600">Day Streak</div>
            <div className="text-xs text-secondary-500 mt-1">Keep it up!</div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Study Time Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Study Time (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studyTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} min`, 'Study Time']} />
                <Line type="monotone" dataKey="duration" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Course Categories */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Hours by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}h`, 'Study Hours']} />
                <Bar dataKey="hours" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Course Completion and Achievement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Completion Rate Pie Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Course Completion</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Achievements */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">{achievement.title}</h4>
                    <p className="text-sm text-secondary-600">{achievement.description}</p>
                  </div>
                  <Badge variant="success" size="sm">New</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Goals */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Learning Goals</h3>
            <div className="space-y-4">
              {learningGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-secondary-900">{goal.title}</h4>
                    <span className="text-sm text-secondary-600">
                      {goal.currentProgress}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <Progress
                    value={goal.currentProgress}
                    max={goal.targetValue}
                    className="w-full"
                  />
                  <div className="text-xs text-secondary-500">
                    Due: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Activity Heatmap</h3>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-xs text-secondary-500 p-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 84 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (83 - i));
              const dateStr = date.toISOString().split('T')[0];
              const activity = calendarData[dateStr] || 0;
              const intensity = Math.min(Math.floor(activity / 30), 4);
              
              return (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${
                    intensity === 0 ? 'bg-secondary-100' :
                    intensity === 1 ? 'bg-green-200' :
                    intensity === 2 ? 'bg-green-300' :
                    intensity === 3 ? 'bg-green-500' : 'bg-green-600'
                  }`}
                  title={`${date.toDateString()}: ${activity} minutes`}
                />
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-4 text-xs text-secondary-500">
            <span>12 weeks ago</span>
            <div className="flex items-center space-x-1">
              <span>Less</span>
              <div className="w-3 h-3 bg-secondary-100 rounded-sm" />
              <div className="w-3 h-3 bg-green-200 rounded-sm" />
              <div className="w-3 h-3 bg-green-300 rounded-sm" />
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <div className="w-3 h-3 bg-green-600 rounded-sm" />
              <span>More</span>
            </div>
            <span>Today</span>
          </div>
        </Card>

        {/* Detailed Course Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Course Progress Breakdown</h3>
          <div className="space-y-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-secondary-900">{course.title}</h4>
                    <p className="text-sm text-secondary-600">{course.instructor}</p>
                  </div>
                  <Badge className="text-xs">
                    {course.progress}% Complete
                  </Badge>
                </div>
                
                <Progress value={course.progress} className="mb-4" showLabel={true} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-500">Lessons:</span>
                    <span className="ml-2 font-medium">{course.completedLessons}/{course.totalLessons}</span>
                  </div>
                  <div>
                    <span className="text-secondary-500">Time Spent:</span>
                    <span className="ml-2 font-medium">{course.completedLessons * 0.5}h</span>
                  </div>
                  <div>
                    <span className="text-secondary-500">Last Access:</span>
                    <span className="ml-2 font-medium">
                      {course.lastAccessedAt ? new Date(course.lastAccessedAt).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
