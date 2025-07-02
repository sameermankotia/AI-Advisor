import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { 
  Calendar, 
  TrendingUp, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Copy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import CourseCard from './CourseCard';

const TermContainer = ({ 
  term, 
  courses = [], 
  totalCredits = 0, 
  estimatedGPA = 0,
  onClearTerm,
  isDragOver = false 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const getTermStyles = (season) => {
    const styles = {
      'Fall': {
        border: '2px dashed #f59e0b',
        background: '#fef3c7',
        headerBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
        headerText: '#92400e'
      },
      'Spring': {
        border: '2px dashed #10b981',
        background: '#d1fae5',
        headerBg: 'linear-gradient(135deg, #10b981, #059669)',
        headerText: '#065f46'
      },
      'Summer': {
        border: '2px dashed #3b82f6',
        background: '#dbeafe',
        headerBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        headerText: '#1e40af'
      }
    };
    return styles[season] || styles['Fall'];
  };

  const getWorkloadStatus = () => {
    if (totalCredits <= 12) return { text: 'Light', color: '#10b981', icon: '🟢' };
    if (totalCredits <= 16) return { text: 'Normal', color: '#f59e0b', icon: '🟡' };
    if (totalCredits <= 18) return { text: 'Heavy', color: '#ef4444', icon: '🟠' };
    return { text: 'Overload', color: '#dc2626', icon: '🔴' };
  };

  const getValidationStatus = () => {
    const issues = [];
    
    if (totalCredits > 20) {
      issues.push('Exceeds 20 credit maximum');
    }
    
    if (totalCredits > 18) {
      issues.push('Heavy course load - consider advisor approval');
    }

    if (courses.length > 6) {
      issues.push('Many courses - time management may be challenging');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const copyToNextTerm = () => {
    // This would need to be implemented at the parent level
    console.log('Copy courses to next term');
    setShowMenu(false);
  };

  const handleClearTerm = () => {
    if (onClearTerm) {
      onClearTerm();
    }
    setShowClearConfirm(false);
    setShowMenu(false);
  };

  const termStyles = getTermStyles(term.season);
  const workload = getWorkloadStatus();
  const validation = getValidationStatus();

  return (
    <div 
      className="term-container hover-lift scale-in"
      style={{
        border: isDragOver ? '2px solid #3b82f6' : termStyles.border,
        background: isDragOver ? '#f0f9ff' : 'white',
        borderRadius: 'var(--radius-2xl)',
        minHeight: '300px',
        transition: 'all var(--transition-normal)',
        transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragOver ? 'var(--shadow-xl)' : 'var(--shadow-md)',
        position: 'relative'
      }}
    >
      {/* Term Header */}
      <div 
        className="rounded-2xl p-lg text-white relative"
        style={{
          background: termStyles.headerBg,
          borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header Top Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-sm">
            <Calendar size={18} />
            <h3 className="text-lg font-bold">{term.term_name}</h3>
          </div>
          
          <div className="flex items-center gap-sm">
            <div className="text-sm font-semibold">
              {totalCredits} Credits
            </div>
            
            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-sm rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid #e5e7eb',
                  minWidth: '160px',
                  zIndex: 10
                }}>
                  <button
                    onClick={copyToNextTerm}
                    className="flex items-center gap-sm w-full p-sm text-left hover:bg-gray-50"
                    style={{ border: 'none', background: 'none', color: '#374151', fontSize: '0.875rem' }}
                  >
                    <Copy size={14} />
                    Copy to Next Term
                  </button>
                  
                  {courses.length > 0 && (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="flex items-center gap-sm w-full p-sm text-left hover:bg-red-50"
                      style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.875rem' }}
                    >
                      <Trash2 size={14} />
                      Clear Term
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Header Bottom Row */}
        <div className="flex justify-between items-center mt-sm">
          <div className="flex items-center gap-lg">
            <span className="text-sm" style={{ opacity: 0.9 }}>
              {term.season} {term.year}
            </span>
            
            <div className="flex items-center gap-sm">
              <Clock size={12} />
              <span className="text-xs">
                {courses.length} course{courses.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-sm">
            {/* Workload Indicator */}
            <div className="flex items-center gap-sm rounded-lg p-sm" style={{
              background: 'rgba(255, 255, 255, 0.2)'
            }}>
              <span className="text-xs">{workload.icon}</span>
              <span className="text-xs font-semibold">
                {workload.text}
              </span>
            </div>
            
            {/* GPA Estimate */}
            {estimatedGPA > 0 && (
              <div className="flex items-center gap-sm rounded-lg p-sm" style={{
                background: 'rgba(255, 255, 255, 0.2)'
              }}>
                <TrendingUp size={12} />
                <span className="text-xs font-semibold">
                  GPA: {estimatedGPA.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Validation Status */}
        {!validation.isValid && (
          <div className="mt-sm p-sm rounded-lg" style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div className="flex items-center gap-sm">
              <AlertTriangle size={12} />
              <span className="text-xs font-medium">
                {validation.issues[0]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={`term-${term.id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-lg"
            style={{
              minHeight: '200px',
              background: snapshot.isDraggingOver ? '#f0f9ff' : 'transparent',
              transition: 'background var(--transition-fast)',
              position: 'relative'
            }}
          >
            {/* Course List */}
            <div className="grid gap-sm">
              {courses.map((course, index) => (
                <div key={`${course.id}-${index}`} className="scale-in" style={{
                  animationDelay: `${index * 0.1}s`
                }}>
                  <CourseCard 
                    course={course} 
                    index={index}
                    isDragging={false}
                  />
                </div>
              ))}
            </div>

            {/* Drop Zone Hint */}
            {courses.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center p-xl" style={{
                height: '140px',
                color: 'var(--secondary-gray)',
                opacity: 0.6,
                border: '2px dashed #e5e7eb',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-fast)'
              }}>
                <Plus size={32} className="mb-sm" />
                <p className="text-sm font-medium">Drop courses here</p>
                <p className="text-xs">Plan your {term.season.toLowerCase()} semester</p>
                <div className="mt-sm flex items-center gap-sm text-xs" style={{ opacity: 0.7 }}>
                  <Target size={10} />
                  <span>Recommended: 12-16 credits</span>
                </div>
              </div>
            )}

            {/* Add More Courses Hint */}
            {courses.length > 0 && courses.length < 6 && totalCredits < 18 && (
              <div 
                className="flex items-center justify-center text-center p-md rounded-lg mt-sm hover-lift"
                style={{
                  border: '2px dashed #d1d5db',
                  color: 'var(--secondary-gray)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-blue)';
                  e.currentTarget.style.color = 'var(--primary-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.color = 'var(--secondary-gray)';
                }}
              >
                <Plus size={16} className="mr-sm" />
                <span className="text-sm">Add another course</span>
                <span className="text-xs ml-sm" style={{ opacity: 0.7 }}>
                  ({18 - totalCredits} credits available)
                </span>
              </div>
            )}

            {/* Drag Overlay Effect - Clean and Professional */}
            {snapshot.isDraggingOver && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: 'var(--radius-lg)',
                pointerEvents: 'none',
                border: '2px solid rgba(59, 130, 246, 0.3)'
              }} />
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Term Footer with Enhanced Stats */}
      {courses.length > 0 && (
        <div className="p-md rounded-b-2xl" style={{
          background: validation.isValid ? '#f8fafc' : '#fef2f2',
          borderTop: `1px solid ${validation.isValid ? '#e5e7eb' : '#fecaca'}`
        }}>
          {/* Stats Row */}
          <div className="flex justify-between items-center text-xs mb-sm">
            <div className="flex items-center gap-sm">
              <span className="font-medium text-gray">
                {courses.length} course{courses.length !== 1 ? 's' : ''}
              </span>
              <span style={{ color: workload.color, fontWeight: '500' }}>
                {workload.icon} {workload.text}
              </span>
            </div>
            
            <div className="flex items-center gap-sm">
              {validation.isValid ? (
                <div className="flex items-center gap-xs text-success">
                  <CheckCircle size={12} />
                  <span>Valid</span>
                </div>
              ) : (
                <div className="flex items-center gap-xs text-error">
                  <AlertTriangle size={12} />
                  <span>Issues</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Credit Progress Bar */}
          <div className="mb-sm">
            <div className="flex justify-between text-xs text-gray mb-xs">
              <span>Credit Load</span>
              <span>{totalCredits}/18 recommended</span>
            </div>
            <div className="progress-bar" style={{ height: '6px' }}>
              <div 
                className="progress-fill"
                style={{ 
                  width: `${Math.min((totalCredits / 18) * 100, 100)}%`,
                  background: totalCredits > 18 ? 'var(--error-red)' : 
                            totalCredits > 16 ? 'var(--warning-orange)' : 
                            'var(--success-green)'
                }}
              ></div>
            </div>
          </div>

          {/* Additional Info for Heavy Loads */}
          {totalCredits > 16 && (
            <div className="text-xs" style={{ 
              color: totalCredits > 18 ? '#dc2626' : '#d97706',
              fontStyle: 'italic'
            }}>
              {totalCredits > 18 ? 
                '⚠️ Requires special permission from advisor' : 
                '💡 Consider time management and study load'
              }
            </div>
          )}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '300px', margin: '2rem' }}>
            <div className="flex items-center gap-md mb-lg">
              <AlertTriangle size={20} className="text-warning" />
              <h4 className="font-bold text-gray">Clear Term</h4>
            </div>
            
            <p className="text-sm text-gray mb-lg">
              Remove all {courses.length} course{courses.length !== 1 ? 's' : ''} from {term.term_name}?
            </p>

            <div className="flex gap-sm justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleClearTerm}
                className="btn btn-sm"
                style={{ background: '#ef4444', color: 'white' }}
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5
          }}
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TermContainer;