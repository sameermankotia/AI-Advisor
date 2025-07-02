import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import TermContainer from './TermContainer';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Trash2, 
  RotateCcw, 
  Download,
  Upload,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

const PlanningBoard = ({ academicPlan, setAcademicPlan }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearType, setClearType] = useState('all'); // 'all', 'term', 'specific'
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const terms = [
    { id: 1, term_name: 'Fall Term 1', year: 2024, season: 'Fall' },
    { id: 2, term_name: 'Spring Term 1', year: 2025, season: 'Spring' },
    { id: 3, term_name: 'Fall Term 2', year: 2025, season: 'Fall' },
    { id: 4, term_name: 'Spring Term 2', year: 2026, season: 'Spring' },
    { id: 5, term_name: 'Fall Term 3', year: 2026, season: 'Fall' },
    { id: 6, term_name: 'Spring Term 3', year: 2027, season: 'Spring' },
    { id: 7, term_name: 'Fall Term 4', year: 2027, season: 'Fall' },
    { id: 8, term_name: 'Spring Term 4', year: 2028, season: 'Spring' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  // Save to history whenever plan changes
  useEffect(() => {
    if (academicPlan && Object.keys(academicPlan).length > 0) {
      savePlanToHistory();
    }
  }, [academicPlan]);

  const loadData = async () => {
    try {
      const coursesResponse = await apiService.getCourses();
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePlanToHistory = () => {
    const newHistory = planHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(JSON.stringify(academicPlan));
    setPlanHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
    
    // Keep only last 10 states
    if (newHistory.length > 10) {
      const trimmedHistory = newHistory.slice(-10);
      setPlanHistory(trimmedHistory);
      setCurrentHistoryIndex(trimmedHistory.length - 1);
    }
  };

  const undoLastAction = () => {
    if (currentHistoryIndex > 0) {
      const previousPlan = JSON.parse(planHistory[currentHistoryIndex - 1]);
      setAcademicPlan(previousPlan);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  };

  const redoLastAction = () => {
    if (currentHistoryIndex < planHistory.length - 1) {
      const nextPlan = JSON.parse(planHistory[currentHistoryIndex + 1]);
      setAcademicPlan(nextPlan);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  };

  const clearPlan = (type, termId = null) => {
    const newPlan = { ...academicPlan };
    
    switch (type) {
      case 'all':
        Object.keys(newPlan).forEach(key => {
          newPlan[key] = [];
        });
        break;
      case 'term':
        if (termId) {
          newPlan[`term-${termId}`] = [];
        }
        break;
      case 'empty':
        Object.keys(newPlan).forEach(key => {
          if (newPlan[key].length === 0) {
            newPlan[key] = [];
          }
        });
        break;
    }
    
    setAcademicPlan(newPlan);
    setShowClearModal(false);
  };

  const exportPlan = () => {
    const planData = {
      academicPlan,
      metadata: {
        exportDate: new Date().toISOString(),
        totalCredits: getTotalCredits(),
        completionPercentage: getCompletionPercentage(),
        termsPlanned: Object.values(academicPlan).filter(courses => courses.length > 0).length
      }
    };
    
    const dataStr = JSON.stringify(planData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic-plan-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importPlan = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const planData = JSON.parse(e.target.result);
        if (planData.academicPlan) {
          setAcademicPlan(planData.academicPlan);
        }
      } catch (error) {
        console.error('Error importing plan:', error);
        alert('Error importing plan file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const getTermCredits = (termId) => {
    if (!academicPlan || !academicPlan[termId]) return 0;
    const termCourses = academicPlan[termId] || [];
    return termCourses.reduce((total, course) => total + course.credits, 0);
  };

  const getEstimatedGPA = (termId) => {
    if (!academicPlan || !academicPlan[termId]) return 0;
    const termCourses = academicPlan[termId] || [];
    if (termCourses.length === 0) return 0;
    
    const avgDifficulty = termCourses.reduce((sum, course) => 
      sum + (course.difficulty_rating || 3), 0) / termCourses.length;
    
    return Math.max(2.0, 4.5 - (avgDifficulty * 0.3));
  };

  const getTotalCredits = () => {
    if (!academicPlan) return 0;
    return Object.values(academicPlan).flat().reduce(
      (total, course) => total + course.credits, 0
    );
  };

  const getCompletionPercentage = () => {
    return Math.round((getTotalCredits() / 120) * 100);
  };

  const getPlanValidation = () => {
    const issues = [];
    const totalCredits = getTotalCredits();
    
    if (totalCredits < 120) {
      issues.push(`Need ${120 - totalCredits} more credits to graduate`);
    }
    
    // Check for overloaded terms
    Object.keys(academicPlan).forEach(termKey => {
      const termCredits = getTermCredits(termKey);
      if (termCredits > 18) {
        const termNum = termKey.split('-')[1];
        const term = terms.find(t => t.id === parseInt(termNum));
        issues.push(`${term?.term_name} is overloaded (${termCredits} credits)`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const validation = getPlanValidation();

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="loading-spinner mb-lg"></div>
          <p className="text-gray">Loading your academic plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-xl fade-in">
      {/* Enhanced Header Dashboard */}
      <div className="card hover-lift">
        <div className="flex justify-between items-center flex-col-mobile text-center-mobile gap-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray mb-sm">
              Academic Planning Dashboard
            </h1>
            <p className="text-gray" style={{ opacity: 0.8 }}>
              Drag courses from the catalog to plan your degree path
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-sm flex-wrap">
            <button
              onClick={() => undoLastAction()}
              disabled={currentHistoryIndex <= 0}
              className="btn btn-sm"
              style={{
                background: currentHistoryIndex <= 0 ? '#f3f4f6' : '#3b82f6',
                color: currentHistoryIndex <= 0 ? '#9ca3af' : 'white',
                cursor: currentHistoryIndex <= 0 ? 'not-allowed' : 'pointer'
              }}
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw size={14} />
            </button>
            
            <button
              onClick={() => redoLastAction()}
              disabled={currentHistoryIndex >= planHistory.length - 1}
              className="btn btn-sm"
              style={{
                background: currentHistoryIndex >= planHistory.length - 1 ? '#f3f4f6' : '#3b82f6',
                color: currentHistoryIndex >= planHistory.length - 1 ? '#9ca3af' : 'white',
                cursor: currentHistoryIndex >= planHistory.length - 1 ? 'not-allowed' : 'pointer',
                transform: 'scaleX(-1)'
              }}
              title="Redo (Ctrl+Y)"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={exportPlan}
              className="btn btn-sm"
              style={{ background: '#10b981', color: 'white' }}
              title="Export Plan"
            >
              <Download size={14} />
              Export
            </button>

            <label className="btn btn-sm" style={{ background: '#8b5cf6', color: 'white', cursor: 'pointer' }}>
              <Upload size={14} />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importPlan}
                style={{ display: 'none' }}
              />
            </label>

            <button
              onClick={() => setShowClearModal(true)}
              className="btn btn-sm"
              style={{ background: '#ef4444', color: 'white' }}
              title="Clear Plan"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-lg mt-lg flex-col-mobile">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {getTotalCredits()}
            </div>
            <div className="text-sm text-gray">Total Credits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {getCompletionPercentage()}%
            </div>
            <div className="text-sm text-gray">Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {Object.values(academicPlan).filter(courses => courses.length > 0).length}
            </div>
            <div className="text-sm text-gray">Active Terms</div>
          </div>
        </div>
      </div>

      {/* Plan Validation */}
      {!validation.isValid && (
        <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <div className="flex items-start gap-md">
            <AlertTriangle size={20} className="text-error mt-xs" />
            <div>
              <h3 className="font-semibold text-error mb-sm">Plan Validation Issues</h3>
              <ul className="text-sm text-error">
                {validation.issues.map((issue, index) => (
                  <li key={index} className="mb-xs">• {issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Academic Timeline */}
      <div className="card hover-lift">
        <div className="flex justify-between items-center mb-lg flex-col-mobile text-center-mobile gap-md">
          <h2 className="text-xl font-bold text-gray">4-Year Academic Timeline</h2>
          <div className="flex items-center gap-sm text-sm text-gray">
            <Target size={16} />
            <span>Expected Graduation: Spring 2028</span>
            {validation.isValid && <CheckCircle size={16} className="text-success" />}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((year, index) => (
            <div key={year} className="flex items-center">
              <div 
                className="rounded-full"
                style={{
                  width: '12px',
                  height: '12px',
                  background: index === 0 ? 'var(--primary-blue)' : '#e5e7eb'
                }}
              />
              <div className="ml-sm text-sm font-medium">
                Year {year}
              </div>
              {index < 3 && (
                <div style={{
                  width: '64px',
                  height: '2px',
                  background: '#e5e7eb',
                  marginLeft: 'var(--spacing-md)'
                }} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-lg">
          <div className="flex justify-between text-sm text-gray mb-sm">
            <span>Degree Completion</span>
            <span>{getCompletionPercentage()}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid gap-lg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        {terms.map((term) => (
          <TermContainer
            key={term.id}
            term={term}
            courses={academicPlan ? (academicPlan[`term-${term.id}`] || []) : []}
            totalCredits={getTermCredits(`term-${term.id}`)}
            estimatedGPA={getEstimatedGPA(`term-${term.id}`)}
            onClearTerm={() => clearPlan('term', term.id)}
          />
        ))}
      </div>

      {/* Status Summary */}
      <div className="card" style={{ background: '#f8fafc' }}>
        <div className="flex justify-between items-center text-sm flex-col-mobile text-center-mobile gap-lg">
          <div className="flex gap-xl flex-col-mobile">
            <div className="flex items-center gap-sm">
              <span className={`status-dot ${validation.isValid ? 'success' : 'warning'}`}></span>
              <span className="font-medium text-gray">
                Plan Status: {getTotalCredits() > 0 ? (validation.isValid ? 'Valid' : 'Needs Review') : 'Not Started'}
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <Calendar size={14} className="text-primary" />
              <span className="text-gray">
                Planned Terms: {Object.values(academicPlan).filter(courses => courses.length > 0).length}
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <TrendingUp size={14} className="text-warning" />
              <span className="text-gray">
                Remaining: {120 - getTotalCredits()} credits
              </span>
            </div>
          </div>
          <div className="flex items-center gap-sm text-gray">
            <BarChart3 size={14} />
            <span>Auto-saved • {planHistory.length} revisions</span>
          </div>
        </div>
      </div>

      {/* Clear Plan Modal */}
      {showClearModal && (
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
          <div className="card" style={{ maxWidth: '400px', margin: '2rem' }}>
            <div className="flex items-center gap-md mb-lg">
              <AlertTriangle size={24} className="text-warning" />
              <h3 className="text-lg font-bold text-gray">Clear Academic Plan</h3>
            </div>
            
            <p className="text-gray mb-lg">
              What would you like to clear from your academic plan?
            </p>

            <div className="grid gap-sm mb-lg">
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="radio"
                  name="clearType"
                  value="all"
                  checked={clearType === 'all'}
                  onChange={(e) => setClearType(e.target.value)}
                />
                <span className="text-sm">Clear entire plan</span>
              </label>
              
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="radio"
                  name="clearType"
                  value="empty"
                  checked={clearType === 'empty'}
                  onChange={(e) => setClearType(e.target.value)}
                />
                <span className="text-sm">Clear only empty terms</span>
              </label>
            </div>

            <div className="flex gap-sm justify-end">
              <button
                onClick={() => setShowClearModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => clearPlan(clearType)}
                className="btn"
                style={{ background: '#ef4444', color: 'white' }}
              >
                <Trash2 size={14} />
                Clear Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningBoard;