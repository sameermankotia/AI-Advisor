from flask import Blueprint, request, jsonify, current_app
import ollama
import json
from datetime import datetime

ai_bp = Blueprint('ai', __name__)

class AcademicAdvisorAI:
    def __init__(self):
        self.model_name = "enhanced-academic-advisor:latest"
        
    def generate_response(self, student_id, user_message, current_plan=None):
        """Generate personalized AI response using Ollama"""
        try:
            # Import here to avoid circular import
            from app.models import Student
            
            # Get student context
            student = Student.query.get(student_id)
            student_name = student.name if student else "Student"
            student_gpa = student.current_gpa if student else "N/A"
            
            # Analyze current plan
            total_credits = 0
            if current_plan:
                for courses in current_plan.values():
                    total_credits += sum(course.get('credits', 0) for course in courses)
            
            # Create personalized prompt
            context_prompt = f"""
STUDENT: {student_name}
GPA: {student_gpa}
TOTAL CREDITS PLANNED: {total_credits}

QUESTION: {user_message}

You must use ONLY the exact course codes from our curriculum (CS 1102, CS 1121, CS 2045, etc.). Do not make up course codes."""

            # Call Ollama API with explicit model name
            response = ollama.chat(
                model="enhanced-academic-advisor:latest",
                messages=[{"role": "user", "content": context_prompt}],
                options={"temperature": 0.7, "num_predict": 200}
            )
            
            return response['message']['content'].strip()
            
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return f"I'm having trouble connecting right now, but I can still help you plan your CS courses!"

# Initialize AI advisor
advisor_ai = AcademicAdvisorAI()

@ai_bp.route('/recommend', methods=['POST'])
def get_recommendation():
    """Get AI-powered academic recommendations"""
    try:
        data = request.get_json()
        student_id = data.get('student_id', 1)
        context = data.get('context', '')
        current_plan = data.get('current_plan', {})
        
        if not context:
            return jsonify({'error': 'No context provided'}), 400
        
        recommendation = advisor_ai.generate_response(
            student_id=student_id,
            user_message=context,
            current_plan=current_plan
        )
        
        return jsonify({
            'recommendation': recommendation,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in AI recommendation: {e}")
        return jsonify({
            'recommendation': "I'm here to help with your academic planning!",
            'error': str(e)
        }), 500