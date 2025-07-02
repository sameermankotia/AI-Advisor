import React, { useState, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Search, Filter, BookOpen, GraduationCap } from 'lucide-react';
import { apiService } from '../services/api';
import CourseCard from './CourseCard';

const CourseCatalog = () => {
 const [courses, setCourses] = useState([]);
 const [filteredCourses, setFilteredCourses] = useState([]);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedDepartment, setSelectedDepartment] = useState('All');
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   loadCourses();
 }, []);

 useEffect(() => {
   filterCourses();
 }, [courses, searchTerm, selectedDepartment]);

 const loadCourses = async () => {
   try {
     const response = await apiService.getCourses();
     setCourses(response.data);
   } catch (error) {
     console.error('Error loading courses:', error);
   } finally {
     setLoading(false);
   }
 };

 const filterCourses = () => {
   let filtered = courses;

   if (searchTerm) {
     filtered = filtered.filter(course =>
       course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
     );
   }

   if (selectedDepartment !== 'All') {
     filtered = filtered.filter(course => course.department === selectedDepartment);
   }

   setFilteredCourses(filtered);
 };

 const getDepartments = () => {
   const departments = [...new Set(courses.map(course => course.department))];
   return ['All', ...departments.sort()];
 };

 if (loading) {
   return (
     <div className="card fade-in">
       <div className="animate-pulse">
         <div className="mb-lg" style={{ height: '24px', background: '#e5e7eb', borderRadius: 'var(--radius-md)' }}></div>
         <div className="mb-md" style={{ height: '40px', background: '#e5e7eb', borderRadius: 'var(--radius-md)' }}></div>
         <div className="grid gap-sm">
           {[...Array(5)].map((_, i) => (
             <div key={i} style={{ height: '80px', background: '#e5e7eb', borderRadius: 'var(--radius-lg)' }}></div>
           ))}
         </div>
       </div>
     </div>
   );
 }

 return (
   <div className="card fade-in">
     {/* Header */}
     <div className="card-header flex items-center gap-md mb-xl">
       <BookOpen size={24} />
       <div>
         <h2 className="text-xl font-bold text-white">Course Catalog</h2>
         <p className="text-sm text-white" style={{ opacity: 0.9 }}>
           Drag courses to your plan
         </p>
       </div>
     </div>

     {/* Search */}
     <div className="mb-lg" style={{ position: 'relative' }}>
       <Search size={18} style={{ 
         position: 'absolute', 
         left: 'var(--spacing-md)', 
         top: '50%', 
         transform: 'translateY(-50%)',
         color: 'var(--secondary-gray)'
       }} />
       <input
         type="text"
         placeholder="Search courses..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className="input"
         style={{ paddingLeft: '2.5rem' }}
       />
     </div>

     {/* Filter */}
     <div className="mb-lg" style={{ position: 'relative' }}>
       <Filter size={16} style={{ 
         position: 'absolute', 
         left: 'var(--spacing-md)', 
         top: '50%', 
         transform: 'translateY(-50%)',
         color: 'var(--secondary-gray)'
       }} />
       <select
         value={selectedDepartment}
         onChange={(e) => setSelectedDepartment(e.target.value)}
         className="select"
         style={{ paddingLeft: '2.5rem' }}
       >
         {getDepartments().map(dept => (
           <option key={dept} value={dept}>{dept}</option>
         ))}
       </select>
     </div>

     {/* Stats */}
     <div className="flex items-center gap-lg text-sm text-gray mb-lg">
       <div className="flex items-center gap-sm">
         <GraduationCap size={16} />
         <span>{filteredCourses.length} courses</span>
       </div>
     </div>

     {/* Course List - FIXED DROPPABLE */}
     <Droppable droppableId="course-catalog" isDropDisabled={true}>
       {(provided, snapshot) => (
         <div
           ref={provided.innerRef}
           {...provided.droppableProps}
           className="grid gap-md"
           style={{ 
             maxHeight: '500px', 
             overflowY: 'auto',
             background: snapshot.isDraggingOver ? '#f0f9ff' : 'transparent'
           }}
         >
           {filteredCourses.length > 0 ? (
             filteredCourses.map((course, index) => (
               <CourseCard
                 key={course.id}
                 course={course}
                 index={index}
                 isDragging={false}
               />
             ))
           ) : (
             <div className="text-center p-xl text-gray">
               <BookOpen size={48} style={{ margin: '0 auto', marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
               <p className="text-sm">No courses found</p>
               <p className="text-xs" style={{ opacity: 0.7 }}>Try adjusting your search</p>
             </div>
           )}
           {provided.placeholder}
         </div>
       )}
     </Droppable>
   </div>
 );
};

export default CourseCatalog;
