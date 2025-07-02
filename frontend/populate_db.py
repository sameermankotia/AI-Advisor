from app import create_app, db
from app.models import Student, Course, Term
from datetime import date

app = create_app()

with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()
    
    # Create sample student
    student = Student(
        name="Sameer Mankotia",
        email="john.doe@university.edu",
        major="Computer Science",
        admission_year=2024,
        current_gpa=3.67
    )
    
    # Create all courses from the university schedule
    courses = [
        # Fall Term 1
        Course(course_code="COMM 1101", course_name="Fundamentals of Oral Communication", credits=3, department="Communications", difficulty_rating=2.0, terms_offered="Fall,Spring"),
        Course(course_code="CS 1102", course_name="Computer Science I", credits=4, department="Computer Science", difficulty_rating=3.0, terms_offered="Fall,Spring"),
        Course(course_code="ENGL 1101", course_name="Writing and Rhetoric I", credits=3, department="English", difficulty_rating=2.5, terms_offered="Fall,Spring,Summer"),
        Course(course_code="MATH 1141", course_name="Precalculus & Algebra", credits=3, department="Mathematics", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="MATH 1143", course_name="Precalculus & Trigonometry", credits=3, department="Mathematics", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="Humanistic and Artistic Ways of Knowing Course", course_name="Humanistic and Artistic Ways of Knowing", credits=3, department="General Education", difficulty_rating=2.0, terms_offered="Fall,Spring"),
        
        # Spring Term 1
        Course(course_code="ENGL 1102", course_name="Writing and Rhetoric II", credits=3, department="English", difficulty_rating=2.5, terms_offered="Fall,Spring"),
        Course(course_code="CS 1121", course_name="Computer Science II", credits=3, department="Computer Science", difficulty_rating=3.5, terms_offered="Fall,Spring"),
        Course(course_code="CS 1140", course_name="Computer Organization and Architecture", credits=3, department="Computer Science", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="MATH 1170", course_name="Calculus I", credits=4, department="Mathematics", difficulty_rating=4.5, terms_offered="Fall,Spring"),
        Course(course_code="MATH 1755", course_name="Discrete Mathematics", credits=3, department="Mathematics", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        
        # Fall Term 2
        Course(course_code="MATH 1175", course_name="Calculus II", credits=4, department="Mathematics", difficulty_rating=4.5, terms_offered="Fall,Spring"),
        Course(course_code="CS 2100", course_name="Programming Languages", credits=3, department="Computer Science", difficulty_rating=3.5, terms_offered="Fall,Spring"),
        Course(course_code="Science with Lab Course from approved list", course_name="Science with Lab Course", credits=4, department="Science", difficulty_rating=3.0, terms_offered="Fall,Spring"),
        Course(course_code="Elective Course(s)", course_name="Elective Course", credits=1, department="General Education", difficulty_rating=2.0, terms_offered="Fall,Spring,Summer"),
        
        # Spring Term 2
        Course(course_code="CS 2045", course_name="Computer Operating Systems", credits=3, department="Computer Science", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="CS 2255", course_name="System Software", credits=3, department="Computer Science", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="STB 2900", course_name="Sports Ethics and Analysis", credits=3, department="Statistics", difficulty_rating=2.5, terms_offered="Fall,Spring"),
        Course(course_code="STAT 3015", course_name="Probability and Statistics", credits=3, department="Statistics", difficulty_rating=3.5, terms_offered="Fall,Spring"),
        Course(course_code="or STAT 2010", course_name="Statistical Methods", credits=3, department="Statistics", difficulty_rating=3.5, terms_offered="Fall,Spring"),
        
        # Fall Term 3
        Course(course_code="CS 3381", course_name="Software Engineering", credits=4, department="Computer Science", difficulty_rating=4.5, terms_offered="Fall,Spring"),
        Course(course_code="CS 3185", course_name="Theory of Computation", credits=3, department="Computer Science", difficulty_rating=4.5, terms_offered="Fall,Spring"),
        Course(course_code="MATH 3390", course_name="Linear Algebra", credits=3, department="Mathematics", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="Major Technical Elective Course (UPTV Computer Science or Cybersecurity)", course_name="Technical Elective - CS/Cybersecurity", credits=3, department="Computer Science", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="Social and Behavioral Ways of Knowing Course", course_name="Social and Behavioral Ways of Knowing", credits=3, department="General Education", difficulty_rating=2.0, terms_offered="Fall,Spring"),
        
        # Spring Term 3
        Course(course_code="CS 3805", course_name="Database Systems", credits=4, department="Computer Science", difficulty_rating=4.0, terms_offered="Fall,Spring"),
        Course(course_code="CS 3185", course_name="Analysis of Algorithms", credits=3, department="Computer Science", difficulty_rating=4.5, terms_offered="Fall,Spring"),
        Course(course_code="ENGL 3170", course_name="Business Writing", credits=3, department="English", difficulty_rating=2.5, terms_offered="Fall,Spring"),
        
        # Fall Term 4
        Course(course_code="CS 4145", course_name="Compiler Design", credits=4, department="Computer Science", difficulty_rating=5.0, terms_offered="Fall,Spring"),
        Course(course_code="CS 4965", course_name="CS Senior Capstone Design I", credits=3, department="Computer Science", difficulty_rating=4.0, terms_offered="Fall"),
        Course(course_code="American Experience Course", course_name="American Experience", credits=3, department="General Education", difficulty_rating=2.0, terms_offered="Fall,Spring"),
        
        # Spring Term 4
        Course(course_code="CS 4910", course_name="CS Senior Capstone Design II", credits=3, department="Computer Science", difficulty_rating=4.0, terms_offered="Spring"),
        Course(course_code="International Course", course_name="International Course", credits=3, department="General Education", difficulty_rating=2.0, terms_offered="Fall,Spring"),
    ]
    
    # Create terms
    terms = [
        Term(term_name="Fall Term 1", year=2024, season="Fall", start_date=date(2024, 8, 26), end_date=date(2024, 12, 15)),
        Term(term_name="Spring Term 1", year=2025, season="Spring", start_date=date(2025, 1, 13), end_date=date(2025, 5, 10)),
        Term(term_name="Fall Term 2", year=2025, season="Fall", start_date=date(2025, 8, 25), end_date=date(2025, 12, 14)),
        Term(term_name="Spring Term 2", year=2026, season="Spring", start_date=date(2026, 1, 12), end_date=date(2026, 5, 9)),
        Term(term_name="Fall Term 3", year=2026, season="Fall", start_date=date(2026, 8, 24), end_date=date(2026, 12, 13)),
        Term(term_name="Spring Term 3", year=2027, season="Spring", start_date=date(2027, 1, 11), end_date=date(2027, 5, 8)),
        Term(term_name="Fall Term 4", year=2027, season="Fall", start_date=date(2027, 8, 23), end_date=date(2027, 12, 12)),
        Term(term_name="Spring Term 4", year=2028, season="Spring", start_date=date(2028, 1, 10), end_date=date(2028, 5, 7)),
    ]
    
    # Add all to database
    db.session.add(student)
    for course in courses:
        db.session.add(course)
    for term in terms:
        db.session.add(term)
    
    db.session.commit()
    print("Real university course data added successfully!")
    print(f"Created student: {student.name}")
    print(f"Created {len(courses)} courses")
    print(f"Created {len(terms)} terms")
