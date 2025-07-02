import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, TrendingUp, Sparkles, Brain, Zap, Target, BookOpen, User, GraduationCap } from 'lucide-react';
import { apiService } from '../services/api';

const AIAdvisor = ({ studentId = 1, currentPlan = {}, student = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeConversation();
  }, [currentPlan, student]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeConversation = () => {
    const stats = getProgressStats();
    const welcomeMessage = {
      id: 1,
      type: 'ai',
      content: generateWelcomeMessage(stats),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const generateWelcomeMessage = (stats) => {
    const name = student?.name?.split(' ')[0] || 'there';
    
    if (stats.coursesPlanned === 0) {
      return `Hi ${name}! 👋 I'm your personalized AI Academic Advisor, trained specifically for your Computer Science program. I know all about courses like CS 1102, CS 2045, and MATH 1170. Ready to plan your path to graduation? What would you like to know first?`;
    }
    
    if (stats.completionPercentage < 25) {
      return `Welcome back, ${name}! 📚 I see you've planned ${stats.coursesPlanned} courses (${stats.totalCredits} credits). I can help you with course sequencing, prerequisites, and optimizing your academic plan. What can I assist with today?`;
    }
    
    if (stats.completionPercentage >= 75) {
      return `Hey ${name}! 🎓 You're ${stats.completionPercentage}% complete - fantastic progress! You're well on track for graduation. I can help you select the best electives and prepare for your capstone courses. How can I help?`;
    }
    
    return `Hi ${name}! 💡 You've planned ${stats.coursesPlanned} courses totaling ${stats.totalCredits} credits. I can provide specific guidance using our real CS curriculum. What academic question do you have?`;
  };

  const sendMessage = async (message = null, isQuickPrompt = false) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    if (!isQuickPrompt) setInputMessage('');

    try {
      // Enhanced context for personalized AI
      const contextData = {
        context: messageToSend,
        current_plan: currentPlan,
        student_info: student,
        plan_stats: getProgressStats()
      };

      const response = await apiService.getAIRecommendation(studentId, contextData);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.recommendation,
        timestamp: new Date(),
        model_used: response.data.model_used
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm having trouble connecting to my enhanced model right now, but I'm still here to help! Try asking about specific CS courses like CS 1102, CS 2045, or course planning strategies.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getProgressStats = () => {
    const totalCredits = Object.values(currentPlan).flat().reduce(
      (sum, course) => sum + (course.credits || 0), 0
    );
    
    return {
      totalCredits,
      completionPercentage: Math.round((totalCredits / 120) * 100),
      coursesPlanned: Object.values(currentPlan).flat().length,
      activeTerms: Object.values(currentPlan).filter(courses => courses.length > 0).length
    };
  };

  const smartPrompts = [
    {
      category: "Course Planning",
      icon: <BookOpen size={12} />,
      color: "#3b82f6",
      prompts: [
        "What CS courses should I take next semester?",
        "Help me plan my sophomore year courses",
        "Which prerequisites am I missing?",
        "Suggest technical electives for me"
      ]
    },
    {
      category: "Academic Strategy", 
      icon: <Target size={12} />,
      color: "#10b981",
      prompts: [
        "How can I improve my academic performance?",
        "Plan my 4-year graduation timeline",
        "What's my optimal course load per term?",
        "Review and optimize my current plan"
      ]
    },
    {
      category: "Career Preparation",
      icon: <TrendingUp size={12} />,
      color: "#8b5cf6",
      prompts: [
        "What courses prepare me for software engineering?",
        "How should I prepare for internships?",
        "Which skills should I focus on developing?",
        "Prepare me for graduate school applications"
      ]
    }
  ];

  const stats = getProgressStats();

  return (
    <div className="card fade-in">
      {/* Enhanced Header */}
      <div className="card-header flex items-center gap-md mb-xl">
        <div className="rounded-full flex items-center justify-center" style={{
          width: '48px',
          height: '48px',
          background: 'rgba(255, 255, 255, 0.2)',
          position: 'relative'
        }}>
          <Brain size={24} />
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '16px',
            height: '16px',
            background: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={8} style={{ color: 'white' }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="text-lg font-bold text-white flex items-center gap-sm">
            Smart Advisor AI
            <div style={{
              background: 'rgba(251, 191, 36, 0.2)',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '0.6rem',
              color: '#fbbf24'
            }}>
              Enhanced
            </div>
          </h2>
          <p className="text-xs text-white" style={{ opacity: 0.9 }}>
            Personalized for CS Students • Real Course Catalog
          </p>
        </div>
      </div>

      {/* Student Context Display */}
      {student && (
        <div className="mb-lg p-sm rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <div className="flex items-center gap-sm text-xs text-white" style={{ opacity: 0.9 }}>
            <User size={12} />
            <span>{student.name}</span>
            <span>•</span>
            <GraduationCap size={12} />
            <span>{student.major}</span>
            <span>•</span>
            <span>GPA: {student.current_gpa}</span>
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="mb-lg">
        <div className="flex justify-between items-center mb-sm">
          <h3 className="text-sm font-semibold text-gray">Academic Progress</h3>
          <div className="text-xs text-gray">
            {stats.completionPercentage}% Complete
          </div>
        </div>
        
        <div className="progress-bar mb-md">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(stats.completionPercentage, 100)}%` }}
          ></div>
        </div>

        <div className="grid gap-sm" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="text-center rounded-lg p-sm" style={{ background: '#dbeafe' }}>
            <div className="text-lg font-bold text-primary">{stats.totalCredits}</div>
            <div className="text-xs text-primary">Credits</div>
          </div>
          <div className="text-center rounded-lg p-sm" style={{ background: '#d1fae5' }}>
            <div className="text-lg font-bold text-success">{stats.coursesPlanned}</div>
            <div className="text-xs text-success">Courses</div>
          </div>
          <div className="text-center rounded-lg p-sm" style={{ background: '#fef3c7' }}>
            <div className="text-lg font-bold text-warning">{stats.activeTerms}</div>
            <div className="text-xs text-warning">Terms</div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="mb-lg" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <div className="grid gap-md">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.type === 'ai' && (
                  <div className="flex items-center justify-between mb-sm">
                    <div className="flex items-center gap-sm">
                      <Bot size={14} className="text-primary" />
                      <span className="text-xs font-medium text-primary">Academic Advisor</span>
                    </div>
                    {message.model_used && (
                      <div className="text-xs" style={{ 
                        color: message.model_used.includes('enhanced') ? '#10b981' : '#6b7280',
                        fontSize: '0.65rem'
                      }}>
                        {message.model_used.includes('enhanced') ? '🧠 Enhanced' : '⚡ Basic'}
                      </div>
                    )}
                  </div>
                )}
                <div 
                  className="text-sm" 
                  style={{ lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}
                >
                  {message.content}
                </div>
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message ai">
              <div className="message-content">
                <div className="flex items-center gap-sm mb-sm">
                  <Bot size={14} className="text-primary" />
                  <span className="text-xs font-medium text-primary">Academic Advisor</span>
                </div>
                <div className="flex items-center gap-sm">
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--primary-blue)',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s infinite ease-in-out'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--primary-blue)',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s infinite ease-in-out 0.16s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--primary-blue)',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s infinite ease-in-out 0.32s'
                  }}></div>
                  <span className="text-xs text-gray ml-sm">Analyzing your CS curriculum...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Smart Prompts */}
      <div className="mb-lg">
        <p className="text-sm text-gray mb-md">Ask me about:</p>
        {smartPrompts.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-md">
            <div className="flex items-center gap-xs mb-sm">
              <div style={{ color: category.color }}>
                {category.icon}
              </div>
              <span className="text-xs font-medium text-gray">{category.category}</span>
            </div>
            <div className="grid gap-xs" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {category.prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt, true)}
                  disabled={loading}
                  className="btn btn-sm text-xs hover-lift"
                  style={{
                    background: loading ? '#f3f4f6' : 'white',
                    color: loading ? '#9ca3af' : '#374151',
                    border: `1px solid ${category.color}20`,
                    fontSize: '0.7rem',
                    padding: '8px 10px',
                    textAlign: 'left',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `3px solid ${category.color}`
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = category.color;
                      e.target.style.background = `${category.color}10`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = `${category.color}20`;
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Input Area */}
      <div>
        <div className="flex gap-sm mb-sm">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about CS courses, prerequisites, or academic planning..."
            className="input text-sm"
            disabled={loading}
            style={{ 
              fontSize: '0.875rem',
              background: loading ? '#f9fafb' : 'white'
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="btn btn-primary hover-lift"
            style={{
              minWidth: '48px',
              height: '48px',
              borderRadius: '50%',
              padding: 0,
              background: loading || !inputMessage.trim() ? '#d1d5db' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              cursor: loading || !inputMessage.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={18} />
          </button>
        </div>
        
        {/* AI Status */}
        <div className="flex justify-between items-center text-xs text-gray">
          <div className="flex items-center gap-xs">
            <div style={{
              width: '8px',
              height: '8px',
              background: loading ? '#f59e0b' : '#10b981',
              borderRadius: '50%'
            }}></div>
            <span>{loading ? 'Thinking about your CS plan...' : 'Ready to help with academic planning'}</span>
          </div>
          <div className="flex items-center gap-xs">
            <Brain size={10} />
            <span>Enhanced AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;