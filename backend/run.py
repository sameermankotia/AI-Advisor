from app import create_app, db
from app.models import Student, Course, Term, Enrollment, AcademicPlan

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db, 
        'Student': Student, 
        'Course': Course, 
        'Term': Term, 
        'Enrollment': Enrollment, 
        'AcademicPlan': AcademicPlan
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5003)
