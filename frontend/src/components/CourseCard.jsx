import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Clock, BookOpen, Star } from 'lucide-react';

const CourseCard = ({ course, index, isDragging = false }) => {
  const getDepartmentGradient = (department) => {
    const gradients = {
      'Computer Science': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      'Mathematics': 'linear-gradient(135deg, #10b981, #059669)', 
      'English': 'linear-gradient(135deg, #f59e0b, #d97706)',
      'Communications': 'linear-gradient(135deg, #ef4444, #dc2626)',
      'General Education': 'linear-gradient(135deg, #06b6d4, #0891b2)',
      'Science': 'linear-gradient(135deg, #84cc16, #65a30d)',
      'Statistics': 'linear-gradient(135deg, #a855f7, #7c3aed)'
    };
    return gradients[department] || gradients['General Education'];
  };

  const getDifficultyStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={10}
          style={{
            fill: i <= rating ? '#fbbf24' : 'transparent',
            color: i <= rating ? '#fbbf24' : 'rgba(255,255,255,0.3)'
          }}
        />
      );
    }
    return stars;
  };

  return (
    <Draggable draggableId={`course-${course.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="course-card hover-lift"
          style={{
            background: getDepartmentGradient(course.department),
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-md)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all var(--transition-normal)',
            transform: snapshot.isDragging ? 'rotate(5deg) scale(1.05)' : 'none',
            opacity: snapshot.isDragging ? 0.9 : 1,
            zIndex: snapshot.isDragging ? 1000 : 1,
            boxShadow: snapshot.isDragging ? 'var(--shadow-xl)' : 'var(--shadow-md)',
            cursor: 'grab',
            ...provided.draggableProps.style
          }}
        >
          {/* Drag Handle */}
          <div
            {...provided.dragHandleProps}
            style={{
              position: 'absolute',
              top: 'var(--spacing-sm)',
              right: 'var(--spacing-sm)',
              opacity: 0,
              transition: 'opacity var(--transition-fast)',
              cursor: 'grab'
            }}
            className="drag-handle"
          >
            <GripVertical size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </div>

          {/* Course Header */}
          <div className="flex justify-between items-start mb-sm">
            <div className="rounded-full flex items-center justify-center" style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.2)'
            }}>
              <BookOpen size={14} />
            </div>
            <div className="rounded-md text-xs font-semibold" style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 8px'
            }}>
              {course.credits} hrs
            </div>
          </div>

          {/* Course Info */}
          <div>
            <h3 className="font-bold text-sm mb-xs">
              {course.course_code}
            </h3>
            <p className="text-xs mb-sm" style={{ 
              opacity: 0.95,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {course.course_name}
            </p>
            
            {/* Course Meta */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-xs">
                {getDifficultyStars(course.difficulty_rating || 3)}
              </div>
              <div className="flex items-center gap-xs text-xs" style={{ opacity: 0.8 }}>
                <Clock size={8} />
                <span>{course.terms_offered}</span>
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div 
            className="hover-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
              borderRadius: 'var(--radius-xl)',
              opacity: 0,
              transition: 'opacity var(--transition-normal)',
              pointerEvents: 'none'
            }}
          />

          {/* Shine Effect */}
          <div 
            className="shine-effect"
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}
    </Draggable>
  );
};

export default CourseCard;
