import React, { useEffect, useState, useRef } from 'react';
import { Card, Badge, Button, Input, Select, LoadingSpinner } from '../components/ui';
import useStore from '../store';

const AssignmentTracker: React.FC = () => {
  const { assignments, isLoading, loadAssignments, updateAssignmentStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!loadedRef.current && assignments.length === 0) {
      console.log('Loading assignments (once on mount)...');
      loadedRef.current = true;
      loadAssignments();
    }
  }, []);

  // Debug logs - limit output to prevent console spam
  if (assignments.length > 0) {
    console.log('AssignmentTracker - assignments loaded:', assignments.length);
  }

  // Enhanced calculations with proper color coding
  const assignmentCounts = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'graded').length,
    overdue: assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      const now = new Date();
      return dueDate < now && a.status !== 'graded' && a.status !== 'submitted';
    }).length,
    upcoming: assignments.filter(a => a.status === 'not-started' || a.status === 'in-progress').length,
  };

  // Enhanced filtering and sorting
  const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
      const matchesCourse = filterCourse === 'all' || assignment.courseId === filterCourse;
      return matchesSearch && matchesStatus && matchesCourse;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'course':
          comparison = a.courseName.localeCompare(b.courseName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'points':
          comparison = (a.points || 0) - (b.points || 0);
          break;
        default:
          return 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const uniqueCourses = assignments.map(a => ({ id: a.courseId, name: a.courseName }))
    .filter((course, index, self) => self.findIndex(c => c.id === course.id) === index);

  // Enhanced status and due date functions
  const getAssignmentStatus = (dueDate: string, status: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    
    if (status === 'submitted' || status === 'graded') {
      return status;
    }
    
    if (due < now && status !== 'graded') {
      return 'overdue';
    }
    
    if (dueDay.getTime() === today.getTime()) {
      return 'due-today';
    }
    
    const daysDiff = (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 7 && daysDiff > 0) {
      return 'due-this-week';
    }
    
    return status;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'due-today':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'due-this-week':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDueDateColor = (dueDate: string, status: string) => {
    const actualStatus = getAssignmentStatus(dueDate, status);
    switch (actualStatus) {
      case 'overdue':
        return 'text-red-600';
      case 'due-today':
        return 'text-orange-600';
      case 'due-this-week':
        return 'text-yellow-600';
      default:
        return 'text-gray-900';
    }
  };

  const formatDate = (date: string): string => {
    const dateObj = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateObj.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: dateObj.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleStatusUpdate = async (assignmentId: string, status: string) => {
    await updateAssignmentStatus(assignmentId, status);
  };

  const handleBulkAction = (action: string) => {
    selectedAssignments.forEach(id => {
      if (action === 'mark-complete') {
        handleStatusUpdate(id, 'submitted');
      }
    });
    setSelectedAssignments([]);
  };

  const handleBulkExport = () => {
    const selectedData = assignments.filter(a => selectedAssignments.includes(a.id));
    const csvContent = [
      'Assignment,Course,Due Date,Status,Points',
      ...selectedData.map(a => 
        `"${a.title}","${a.courseName}","${a.dueDate}","${a.status}","${a.points || 0}/${a.maxPoints}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'assignments.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // File upload simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setDraggedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setDraggedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Calendar data
  const getCalendarData = () => {
    const today = new Date();
    const calendar = [];
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get first day of month and days in month
    const firstDay = new Date(year, month, 1);
    //const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayAssignments = assignments.filter(a => 
        a.dueDate.split('T')[0] === dateStr
      );
      
      calendar.push({
        date,
        dateStr,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        assignments: dayAssignments,
      });
    }
    
    return calendar;
  };

  if (isLoading) {
    console.log('Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <div className="ml-4">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Assignment Tracker</h1>
          <p className="text-gray-600 mt-1">Manage and track your course assignments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-900">{assignmentCounts.total}</div>
              <div className="text-sm text-blue-700 font-medium">Total Assignments</div>
            </div>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-900">{assignmentCounts.completed}</div>
              <div className="text-sm text-green-700 font-medium">Completed</div>
            </div>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-red-900">{assignmentCounts.overdue}</div>
              <div className="text-sm text-red-700 font-medium">Overdue</div>
            </div>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-yellow-900">{assignmentCounts.upcoming}</div>
              <div className="text-sm text-yellow-700 font-medium">Upcoming</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Enhanced Filters and Search */}
            <Card className="mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    placeholder="Search assignments or courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'not-started', label: 'Not Started' },
                      { value: 'in-progress', label: 'In Progress' },
                      { value: 'submitted', label: 'Submitted' },
                      { value: 'graded', label: 'Graded' },
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <Select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Courses' },
                      ...uniqueCourses.map(course => ({ value: course.id, label: course.name })),
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                  <Button
                    variant={showCalendar ? 'outline' : 'primary'}
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-32"
                  >
                    {showCalendar ? 'List View' : 'Calendar View'}
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedAssignments.length > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    {selectedAssignments.length} assignment{selectedAssignments.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleBulkAction('mark-complete')}>
                      Mark as Complete
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleBulkExport}>
                      Export CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedAssignments([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Enhanced Assignment List */}
            {!showCalendar ? (
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAssignments(filteredAndSortedAssignments.map(a => a.id));
                              } else {
                                setSelectedAssignments([]);
                              }
                            }}
                            checked={selectedAssignments.length === filteredAndSortedAssignments.length && filteredAndSortedAssignments.length > 0}
                          />
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('title')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Assignment</span>
                            {sortBy === 'title' && (
                              <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('course')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Course</span>
                            {sortBy === 'course' && (
                              <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('dueDate')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Due Date</span>
                            {sortBy === 'dueDate' && (
                              <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            {sortBy === 'status' && (
                              <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('points')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Points</span>
                            {sortBy === 'points' && (
                              <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedAssignments.map((assignment) => {
                        const status = getAssignmentStatus(assignment.dueDate, assignment.status);
                        const statusColor = getStatusColor(status);
                        const dueDateColor = getDueDateColor(assignment.dueDate, assignment.status);
                        
                        return (
                          <tr key={assignment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedAssignments.includes(assignment.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAssignments([...selectedAssignments, assignment.id]);
                                  } else {
                                    setSelectedAssignments(selectedAssignments.filter(id => id !== assignment.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {assignment.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {assignment.courseName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className={dueDateColor + ' font-medium'}>{formatDate(assignment.dueDate)}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={statusColor + ' border'}>
                                {status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {assignment.grade !== undefined ? (
                                <div className="flex items-center">
                                  <span className={assignment.grade >= 80 ? 'text-green-600 font-semibold' : assignment.grade >= 70 ? 'text-yellow-600 font-semibold' : 'text-red-600 font-semibold'}>
                                    {assignment.grade}/{assignment.maxPoints}
                                  </span>
                                  <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${assignment.grade >= 80 ? 'bg-green-500' : assignment.grade >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                      style={{width: `${(assignment.grade / assignment.maxPoints) * 100}%`}}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">
                                  —/{assignment.maxPoints}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedAssignment(assignment)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredAndSortedAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                  </div>
                )}
              </Card>
            ) : (
              /* Calendar View */
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Assignment Calendar</h3>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {getCalendarData().map((day, index) => (
                      <div
                        key={index}
                        className={`
                          min-h-[100px] p-2 border rounded-lg transition-colors
                          ${day.isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 text-gray-400'}
                          ${day.isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                        `}
                      >
                        <div className={`text-sm font-medium mb-1 ${day.isToday ? 'text-blue-600' : ''}`}>
                          {day.date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {day.assignments.slice(0, 3).map((assignment, i) => {
                            const status = getAssignmentStatus(assignment.dueDate, assignment.status);
                            const statusColor = getStatusColor(status);
                            return (
                              <div
                                key={i}
                                className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${statusColor}`}
                                onClick={() => setSelectedAssignment(assignment)}
                                title={assignment.title}
                              >
                                {assignment.title.length > 15 ? assignment.title.substring(0, 15) + '...' : assignment.title}
                              </div>
                            );
                          })}
                          {day.assignments.length > 3 && (
                            <div className="text-xs text-gray-500">+{day.assignments.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="text-sm font-medium">{assignments.filter(a => {
                      const due = new Date(a.dueDate);
                      const now = new Date();
                      const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                      return due >= now && due <= oneWeek;
                    }).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Grade</span>
                    <span className="text-sm font-medium">
                      {assignments.filter(a => a.grade !== undefined).length > 0 
                        ? Math.round(assignments.filter(a => a.grade !== undefined).reduce((sum, a) => sum + (a.grade || 0), 0) / assignments.filter(a => a.grade !== undefined).length)
                        : 'N/A'}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">On Time Rate</span>
                    <span className="text-sm font-medium">
                      {assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length > 0 
                        ? Math.round((assignments.filter(a => (a.status === 'submitted' || a.status === 'graded') && new Date(a.dueDate) >= new Date(a.submittedAt || a.dueDate)).length / assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length) * 100)
                        : 100}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{selectedAssignment.courseName}</p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Assignment Description</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600">{selectedAssignment.description}</p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Submit all required files in the specified format
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Follow coding standards and best practices
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Include proper documentation and comments
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* File Upload Interface */}
                  {(selectedAssignment.status === 'not-started' || selectedAssignment.status === 'in-progress') && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Submit Your Work</h4>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Drag and drop files here, or click to select files
                            </span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                          </label>
                          <p className="mt-2 text-xs text-gray-500">
                            PNG, JPG, PDF, DOC up to 10MB each
                          </p>
                        </div>
                      </div>

                      {/* Uploaded Files */}
                      {draggedFiles.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files</h5>
                          <div className="space-y-2">
                            {draggedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center">
                                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-900">{file.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">({Math.round(file.size / 1024)} KB)</span>
                                </div>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submission History */}
                  {selectedAssignment.submittedAt && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Submission History</h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-green-800">
                            Submitted on {new Date(selectedAssignment.submittedAt).toLocaleDateString()} at{' '}
                            {new Date(selectedAssignment.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-green-700">Files: </span>
                            <span className="text-sm text-green-800">{selectedAssignment.attachments.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Instructor Feedback */}
                  {selectedAssignment.feedback && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Instructor Feedback</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800">{selectedAssignment.feedback}</p>
                      </div>
                    </div>
                  )}

                  {/* Rubric Scores */}
                  {selectedAssignment.rubricScores && selectedAssignment.rubricScores.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Rubric Scores</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {selectedAssignment.rubricScores.map((rubric: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">{rubric.criterion}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{width: `${(rubric.score / rubric.maxScore) * 100}%`}}
                                  ></div>
                                </div>
                                <span className="font-medium text-sm w-12 text-right">{rubric.score}/{rubric.maxScore}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Assignment Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Assignment Info</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className={`font-medium ${getDueDateColor(selectedAssignment.dueDate, selectedAssignment.status)}`}>
                          {formatDate(selectedAssignment.dueDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(getAssignmentStatus(selectedAssignment.dueDate, selectedAssignment.status)) + ' text-xs'}>
                          {getAssignmentStatus(selectedAssignment.dueDate, selectedAssignment.status).replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Points:</span>
                        <span className="font-medium">{selectedAssignment.maxPoints} pts</span>
                      </div>
                      {selectedAssignment.grade !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grade:</span>
                          <span className={`font-medium ${selectedAssignment.grade >= 80 ? 'text-green-600' : selectedAssignment.grade >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {selectedAssignment.grade}/{selectedAssignment.maxPoints} ({Math.round((selectedAssignment.grade / selectedAssignment.maxPoints) * 100)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related Resources */}
                  {selectedAssignment.resources && selectedAssignment.resources.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Related Resources</h4>
                      <div className="space-y-2">
                        {selectedAssignment.resources.map((resource: any, index: number) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {resource.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" onClick={() => setSelectedAssignment(null)} className="w-full">
                      Close
                    </Button>
                    {selectedAssignment.status === 'not-started' && (
                      <Button onClick={() => {
                        handleStatusUpdate(selectedAssignment.id, 'in-progress');
                        setSelectedAssignment(null);
                      }} className="w-full">
                        Start Assignment
                      </Button>
                    )}
                    {selectedAssignment.status === 'in-progress' && (
                      <Button onClick={() => {
                        handleStatusUpdate(selectedAssignment.id, 'submitted');
                        setSelectedAssignment(null);
                      }} className="w-full">
                        Submit Assignment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentTracker;
