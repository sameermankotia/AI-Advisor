# 🎓 Smart Advisor - AI-Powered Academic Planning System

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)](https://flask.palletsprojects.com/)
[![Ollama](https://img.shields.io/badge/Ollama-Llama%203.2-orange.svg)](https://ollama.ai/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38bdf8.svg)](https://tailwindcss.com/)

An intelligent academic planning platform that helps Computer Science students plan their 4-year degree path with AI-powered course recommendations and drag-and-drop scheduling.

## ✨ Features

### 🧠 **AI Academic Advisor**
- **Personalized Recommendations**: Custom Llama 3.2 model trained on real CS curriculum
- **Course Sequencing**: Smart prerequisite tracking and optimal course ordering
- **Academic Planning**: Intelligent workload balancing and graduation timeline optimization
- **Real-time Analysis**: Plan validation with specific feedback and improvement suggestions

### 📚 **Interactive Course Planning**
- **Drag & Drop Interface**: Intuitive course placement across 8 academic terms
- **Real Course Catalog**: Actual university Computer Science curriculum with 30+ courses
- **Prerequisites Validation**: Automatic checking of course dependencies
- **Credit Load Management**: Visual indicators for course load (Light/Normal/Heavy/Overload)

### 📊 **Academic Dashboard**
- **Progress Tracking**: Real-time degree completion percentage (120 credits total)
- **GPA Integration**: Student performance data and academic standing
- **Professional UI**: University-grade interface with modern design
- **Plan Management**: Save, export, import, and share academic plans

### 🎯 **Smart Validation**
- **Credit Limits**: Prevent overloading (20 credit maximum per term)
- **Duplicate Detection**: Avoid scheduling conflicts and repeated courses
- **Graduation Requirements**: Ensure all degree requirements are met
- **Timeline Optimization**: 4-year graduation path planning

## 🛠️ Tech Stack

### **Frontend**
- **React 19.1.0** - Modern UI with hooks and context
- **@hello-pangea/dnd** - Professional drag-and-drop functionality
- **TailwindCSS 4.1.11** - Utility-first styling with custom design system
- **Lucide React** - Beautiful, consistent icons
- **Vite** - Fast development and optimized builds

### **Backend**
- **Flask 2.3.3** - Lightweight Python web framework
- **SQLAlchemy** - Robust database ORM with relationships
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-JWT-Extended** - Authentication and authorization

### **AI/ML**
- **Ollama** - Local AI model hosting and management
- **Llama 3.2** - Meta's advanced language model
- **Custom Academic Model** - Specialized for CS curriculum planning
- **Real Curriculum Training** - Trained on actual course data and prerequisites

### **Database**
- **SQLite** (Development) - Lightweight local database
- **PostgreSQL** (Production ready) - Scalable relational database
- **Comprehensive Models** - Students, Courses, Terms, Enrollments, Academic Plans

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** and pip
- **Node.js 18+** and npm
- **Ollama** for AI functionality

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-advisor.git
cd smart-advisor
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **AI Model Setup**
```bash
# Install Ollama (macOS)
brew install ollama

# Pull base model
ollama pull llama3.2

# Create custom academic advisor model
ollama create enhanced-academic-advisor -f Modelfile
```

5. **Database Initialization**
```bash
cd backend
python populate_db.py
```

6. **Start Development Servers**
```bash
# Terminal 1: Backend
cd backend
python run.py

# Terminal 2: Frontend  
cd frontend
npm run dev

# Terminal 3: AI Service
ollama serve
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5003
- Ollama API: http://localhost:11434

## 💡 Usage

### **Planning Your Degree**
1. **Browse Course Catalog** - Explore 30+ real CS courses with difficulty ratings
2. **Drag Courses to Terms** - Plan your 4-year academic journey
3. **Get AI Recommendations** - Ask the AI advisor for personalized course suggestions
4. **Validate Your Plan** - Ensure prerequisites and credit requirements are met
5. **Export/Import Plans** - Save and share your academic roadmap

### **AI Advisor Capabilities**
- *"What courses should I take next semester?"*
- *"Help me balance my course difficulty"* 
- *"Plan my path to software engineering career"*
- *"I want to graduate early - optimize my schedule"*

## 📁 Project Structure

```
smart-advisor/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory
│   │   ├── models.py            # Database models
│   │   ├── routes.py            # API endpoints
│   │   ├── ai_routes.py         # AI advisor endpoints
│   │   └── config.py            # Configuration
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Application entry point
│   └── populate_db.py          # Database seeding
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AIAdvisor.jsx   # AI chat interface
│   │   │   ├── CourseCard.jsx  # Draggable course cards
│   │   │   ├── CourseCatalog.jsx # Course browser
│   │   │   ├── PlanningBoard.jsx # Main planning interface
│   │   │   └── TermContainer.jsx # Term drop zones
│   │   ├── services/
│   │   │   └── api.js          # API client
│   │   ├── App.jsx             # Main application
│   │   └── index.css           # Global styles
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Build configuration
├── Modelfile                   # Ollama model configuration
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

## 🎨 Key Features Demo

### **Professional Drag & Drop**
- Smooth course card movement without rotation
- Visual feedback for valid drop zones
- Real-time credit calculation and validation
- Professional animations and transitions

### **AI-Powered Recommendations**
- Context-aware responses using student data
- Real course codes (CS 1102, CS 2045, MATH 1170)
- Prerequisite chain understanding
- Personalized academic pathway suggestions

### **Academic Validation**
- Credit limit enforcement (20 max per term)
- Prerequisite requirement checking
- Graduation timeline analysis
- Course difficulty balancing

## 🔧 Configuration

### **Environment Variables**
```bash
# Backend (.env)
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///smart_advisor.db
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=enhanced-academic-advisor:latest

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5003
```

## 🚀 Deployment

### **Option 1: Render (Recommended)**
- One-click deployment with `render.yaml`
- Automatic builds from GitHub
- Built-in database hosting

### **Option 2: Vercel + Railway**
- Frontend on Vercel (React apps)
- Backend on Railway (Python/Flask)
- Separate AI hosting required

### **Option 3: Self-Hosted**
- VPS with Docker containers
- Full control over AI models
- Custom domain and SSL

*See deployment guide in `/docs/deployment.md` for detailed instructions.*

## 📊 Database Schema

```sql
Students: id, name, email, major, admission_year, current_gpa
Courses: id, course_code, course_name, credits, department, difficulty_rating
Terms: id, term_name, year, season, start_date, end_date
Enrollments: student_id, course_id, term_id, grade, status
AcademicPlans: student_id, course_id, planned_term_id, plan_status
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- **Python**: Follow PEP 8 with Black formatting
- **JavaScript**: ESLint configuration with Prettier
- **CSS**: TailwindCSS utility classes preferred

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Meta AI** for the Llama 3.2 language model
- **Ollama Team** for local AI model hosting
- **University Computer Science Department** for curriculum data
- **Open Source Community** for the amazing tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/smart-advisor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/smart-advisor/discussions)
- **Email**: mank8837@vandals.uidaho.edu

---

⭐ **Star this repository if you find it helpful!**

*Built with ❤️ for students, by students*
