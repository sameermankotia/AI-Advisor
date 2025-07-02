from flask import Blueprint, request, jsonify, current_app
from app.models import Student, Course, Term, Enrollment, AcademicPlan, db
import ollama

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({'message': 'Smart Advisor API is running!'})

@main_bp.route('/api/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'email': s.email,
        'major': s.major,
        'current_gpa': s.current_gpa
    } for s in students])

@main_bp.route('/api/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{
        'id': c.id,
        'course_code': c.course_code,
        'course_name': c.course_name,
        'credits': c.credits,
        'department': c.department,
        'difficulty_rating': c.difficulty_rating,
        'terms_offered': c.terms_offered
    } for c in courses])

@main_bp.route('/api/ai/recommend', methods=['POST'])
def ai_recommend():
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        context = data.get('context', '')
        
        # Get student info
        student = Student.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        prompt = f"""
        You are an expert academic advisor for Computer Science students.
        
        Student: {student.name}
        Major: {student.major}
        Current GPA: {student.current_gpa}
        Context: {context}
        
        Please provide 3 specific course recommendations with explanations.
        Keep your response concise and helpful.
        """
        
        # Call Ollama with enhanced model
        model_name = 'enhanced-academic-advisor:latest'
        print(f"DEBUG: Using model: {model_name}")
        response = ollama.chat(model=model_name, messages=[
            {'role': 'user', 'content': prompt}
        ])
        
        return jsonify({
            'recommendation': response['message']['content'],
            'student_name': student.name,
            'model_used': model_name
        })
        
    except Exception as e:
        print(f"ERROR in AI recommend: {e}")
        return jsonify({'error': str(e)}), 500

@main_bp.route('/api/ai/analyze-impact', methods=['POST'])
def ai_analyze_impact():
    try:
        data = request.get_json()
        action = data.get('action')  # 'drop', 'add', 'change'
        course_code = data.get('course_code')
        student_id = data.get('student_id')
        
        student = Student.query.get(student_id)
        course = Course.query.filter_by(course_code=course_code).first()
        
        if not student or not course:
            return jsonify({'error': 'Student or course not found'}), 404
        
        prompt = f"""
        Analyze the impact of {action}ing {course.course_name} ({course_code}) 
        for {student.name} (Major: {student.major}, GPA: {student.current_gpa}).
        
        Course Details:
        - Credits: {course.credits}
        - Prerequisites: {course.prerequisites}
        - Department: {course.department}
        
        Provide a brief impact analysis focusing on:
        1. Graduation timeline effect
        2. Prerequisite chain impact
        3. GPA implications
        4. Alternative recommendations
        """
        
        model_name = 'enhanced-academic-advisor:latest'
        print(f"DEBUG: Using model: {model_name}")
        response = ollama.chat(model=model_name, messages=[
            {'role': 'user', 'content': prompt}
        ])
        
        return jsonify({
            'impact_analysis': response['message']['content'],
            'action': action,
            'course_code': course_code,
            'model_used': model_name
        })
        
    except Exception as e:
        print(f"ERROR in AI analyze: {e}")
        return jsonify({'error': str(e)}), 500

@main_bp.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Smart Advisor API is operational'})