import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { apiService } from './services/api';
import CourseCatalog from './components/CourseCatalog';
import PlanningBoard from './components/PlanningBoard';
import AIAdvisor from './components/AIAdvisor';
import { 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Users, 
  Bell, 
  Settings, 
  Search,
  ChevronDown,
  BookOpen,
  Award,
  Target,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

function App() {
  const [student, setStudent] = useState(null);
  const [academicPlan, setAcademicPlan] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragState, setDragState] = useState({ isDragging: false, draggedItem: null });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadStudentData();
    
    // Keyboard shortcuts
    const handleKeyboard = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        // Undo functionality would be handled by PlanningBoard
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        // Redo functionality would be handled by PlanningBoard
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const loadStudentData = async () => {
    try {
      const [studentsResponse, coursesResponse] = await Promise.all([
        apiService.getStudents(),
        apiService.getCourses()
      ]);
      
      if (studentsResponse.data.length > 0) {
        setStudent(studentsResponse.data[0]);
      }
      
      setCourses(coursesResponse.data);
      
      // Initialize academic plan with proper structure
      const initialPlan = {};
      for (let i = 1; i <= 8; i++) {
        initialPlan[`term-${i}`] = [];
      }
      setAcademicPlan(initialPlan);
      
    } catch (error) {
      console.error('Error loading student data:', error);
      showNotification('Error loading data. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced drag and drop handler with validation and animations
  const onDragStart = useCallback((start) => {
    setDragState({
      isDragging: true,
      draggedItem: start.draggableId
    });

    // Add subtle visual feedback without rotation
    document.body.style.userSelect = 'none';
    document.body.classList.add('dragging');
  }, []);

  const onDragUpdate = useCallback((update) => {
    // Could add real-time validation here
  }, []);

  const onDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    // Reset drag state
    setDragState({ isDragging: false, draggedItem: null });
    document.body.style.userSelect = '';
    document.body.classList.remove('dragging');

    // Validation checks
    if (!destination) {
      return; // Dropped outside droppable area
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return; // Dropped in same position
    }

    // Get the course being dragged
    const courseId = parseInt(draggableId.split('-')[1]);
    const course = courses.find(c => c.id === courseId);

    if (!course) {
      showNotification('Course not found. Please refresh the page.', 'error');
      return;
    }

    // Create new academic plan
    const newPlan = JSON.parse(JSON.stringify(academicPlan)); // Deep copy

    // Remove from source if it was in a term (not from catalog)
    if (source.droppableId.startsWith('term-')) {
      newPlan[source.droppableId] = newPlan[source.droppableId].filter(
        c => c.id !== courseId
      );
    }

    // Add to destination if it's a term
    if (destination.droppableId.startsWith('term-')) {
      if (!newPlan[destination.droppableId]) {
        newPlan[destination.droppableId] = [];
      }

      // Validation: Check for duplicates
      const isDuplicate = newPlan[destination.droppableId].some(c => c.id === courseId);
      if (isDuplicate) {
        showNotification('Course already exists in this term', 'warning');
        return;
      }

      // Validation: Check credit limits (max 20 credits per term)
      const currentCredits = newPlan[destination.droppableId].reduce(
        (sum, c) => sum + (c.credits || 0), 0
      );
      
      if (currentCredits + course.credits > 20) {
        showNotification(`Adding this course would exceed 20 credit limit (${currentCredits + course.credits} total)`, 'warning');
        return;
      }

      // Insert at the correct position
      const destinationCourses = [...newPlan[destination.droppableId]];
      destinationCourses.splice(destination.index, 0, course);
      newPlan[destination.droppableId] = destinationCourses;

      // Show success notification
      const termNum = destination.droppableId.split('-')[1];
      const termNames = ['', 'Fall Term 1', 'Spring Term 1', 'Fall Term 2', 'Spring Term 2', 'Fall Term 3', 'Spring Term 3', 'Fall Term 4', 'Spring Term 4'];
      showNotification(`Added ${course.course_code} to ${termNames[parseInt(termNum)]}`);
    }

    setAcademicPlan(newPlan);
  }, [academicPlan, courses, showNotification]);

  const getProgressStats = () => {
    const totalCredits = Object.values(academicPlan).flat().reduce(
      (sum, course) => sum + (course.credits || 0), 0
    );
    
    const completionPercentage = Math.round((totalCredits / 120) * 100);
    const coursesPlanned = Object.values(academicPlan).flat().length;
    const activeTerms = Object.values(academicPlan).filter(courses => courses.length > 0).length;

    return {
      totalCredits,
      completionPercentage,
      coursesPlanned,
      activeTerms
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner mb-lg"></div>
        <h2 className="text-3xl font-bold text-white mb-sm">Loading Smart Advisor...</h2>
        <p className="text-lg text-white" style={{ opacity: 0.8 }}>Preparing your academic planning dashboard</p>
      </div>
    );
  }

  const stats = getProgressStats();

  return (
    <DragDropContext 
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <div style={{ minHeight: '100vh' }}>
        
        {/* Notification System */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '100px',
            right: '2rem',
            zIndex: 1000,
            background: notification.type === 'error' ? '#fee2e2' : 
                       notification.type === 'warning' ? '#fef3c7' : '#d1fae5',
            border: `1px solid ${notification.type === 'error' ? '#fecaca' : 
                                notification.type === 'warning' ? '#fde68a' : '#a7f3d0'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            maxWidth: '400px',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {notification.type === 'error' && <AlertTriangle size={18} className="text-error" />}
            {notification.type === 'warning' && <AlertTriangle size={18} className="text-warning" />}
            {notification.type === 'success' && <CheckCircle size={18} className="text-success" />}
            <span style={{ 
              fontSize: '0.875rem',
              color: notification.type === 'error' ? '#dc2626' : 
                     notification.type === 'warning' ? '#d97706' : '#059669'
            }}>
              {notification.message}
            </span>
          </div>
        )}

        {/* Enhanced Header with Drag Feedback */}
        <header style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: dragState.isDragging ? '0 8px 25px rgba(0, 0, 0, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'box-shadow 0.3s ease'
        }}>
          
          {/* Top Navigation Bar */}
          <div style={{
            background: dragState.isDragging ? 
              'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)' :
              'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: 'white',
            padding: '0.5rem 0',
            transition: 'background 0.3s ease'
          }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem' }}>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Academic Year 2024-2025
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    Fall Semester
                  </span>
                  <span className="flex items-center gap-2">
                    <Award size={14} />
                    Academic Planning
                  </span>
                  {dragState.isDragging && (
                    <span className="flex items-center gap-2 animate-pulse">
                      <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                      Drag Mode Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ opacity: 0.8 }}>Portal</span>
                  <span style={{ opacity: 0.8 }}>Help</span>
                  <span style={{ opacity: 0.8 }}>Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '1.5rem 2rem' }}>
            <div className="flex justify-between items-center">
              
              {/* University Branding */}
              <div className="flex items-center gap-6">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: dragState.isDragging ? 
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                      'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow: dragState.isDragging ? 
                      '0 8px 25px rgba(16, 185, 129, 0.4)' :
                      '0 8px 25px rgba(59, 130, 246, 0.3)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}>
                    <GraduationCap size={32} style={{ color: 'white' }} />
                    <div style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '12px',
                      height: '12px',
                      background: dragState.isDragging ? '#fbbf24' : '#10b981',
                      borderRadius: '50%',
                      border: '2px solid white',
                      transition: 'background 0.3s ease'
                    }}></div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px'
                    }}>
                      University Academic System
                    </div>
                    <h1 style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      margin: 0,
                      background: 'linear-gradient(135deg, #1e40af, #6366f1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.025em'
                    }}>
                      Smart Advisor
                    </h1>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Intelligent Academic Planning Platform
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation & Tools */}
              <div className="flex items-center gap-4">
                
                {/* Search Bar */}
                <div style={{
                  position: 'relative',
                  minWidth: '300px'
                }}>
                  <Search size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    placeholder="Search courses, requirements, or get help..."
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      background: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                  <div style={{
                    position: 'relative',
                    background: '#f3f4f6',
                    borderRadius: '12px',
                    padding: '10px',
                    cursor: 'pointer'
                  }}>
                    <Bell size={18} style={{ color: '#6b7280' }} />
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      background: '#ef4444',
                      borderRadius: '50%'
                    }}></div>
                  </div>

                  <div style={{
                    background: '#f3f4f6',
                    borderRadius: '12px',
                    padding: '10px',
                    cursor: 'pointer'
                  }}>
                    <Settings size={18} style={{ color: '#6b7280' }} />
                  </div>
                </div>

                {/* Student Profile */}
                {student && (
                  <div style={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                    borderRadius: '16px',
                    padding: '12px 20px',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    minWidth: '280px'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '2px'
                      }}>
                        {student.name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>{student.major}</span>
                        <span>•</span>
                        <span>GPA: {student.current_gpa}</span>
                      </div>
                    </div>
                    <ChevronDown size={16} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Academic Stats Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 0'
          }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1.5rem'
              }}>
                <div className="text-center">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <Target size={16} style={{ color: '#3b82f6' }} />
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      {stats.coursesPlanned}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Courses Planned
                  </div>
                </div>

                <div className="text-center">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <BookOpen size={16} style={{ color: '#10b981' }} />
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      {stats.totalCredits}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total Credits
                  </div>
                </div>

                <div className="text-center">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <TrendingUp size={16} style={{ color: '#f59e0b' }} />
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      {stats.completionPercentage}%
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Degree Progress
                  </div>
                </div>

                <div className="text-center">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <Calendar size={16} style={{ color: '#8b5cf6' }} />
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      2028
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Graduation Year
                  </div>
                </div>

                <div className="text-center">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <Award size={16} style={{ color: '#ef4444' }} />
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: stats.completionPercentage >= 25 ? '#059669' : '#f59e0b'
                    }}>
                      {stats.completionPercentage >= 25 ? 'On Track' : 'Planning'}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Status
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Drag Visual Feedback */}
        <main style={{
          maxWidth: '1600px',
          margin: '2rem auto',
          padding: '0 2rem',
          filter: dragState.isDragging ? 'brightness(0.95)' : 'none',
          transition: 'filter 0.3s ease'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '400px 1fr 400px',
            gap: '2rem',
            alignItems: 'start'
          }}>
            
            <div style={{ position: 'sticky', top: '200px' }}>
              <CourseCatalog />
            </div>

            <div style={{ minHeight: '600px' }}>
              <PlanningBoard 
                academicPlan={academicPlan}
                setAcademicPlan={setAcademicPlan}
              />
            </div>

            <div style={{ position: 'sticky', top: '200px' }}>
              <AIAdvisor 
                studentId={student?.id || 1} 
                currentPlan={academicPlan}
              />
            </div>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          marginTop: '4rem'
        }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem' }}>
            <div className="flex justify-between items-center">
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    System Operational
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp size={14} />
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Academic Plan Validated
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={14} />
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    AI Assistant Connected
                  </span>
                </div>
                {dragState.isDragging && (
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#fbbf24',
                      borderRadius: '50%',
                      animation: 'pulse 1s infinite'
                    }}></div>
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Drag & Drop Active
                    </span>
                  </div>
                )}
              </div>
              
              <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                Smart Advisor v2.1 • University Academic System • Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </DragDropContext>
  );
}

export default App;