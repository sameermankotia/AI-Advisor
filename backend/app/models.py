from app import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    major = db.Column(db.String(100), nullable=False)
    admission_year = db.Column(db.Integer, nullable=False)
    current_gpa = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    enrollments = db.relationship('Enrollment', backref='student', lazy=True)
    academic_plans = db.relationship('AcademicPlan', backref='student', lazy=True)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.String(20), unique=True, nullable=False)
    course_name = db.Column(db.String(200), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    prerequisites = db.Column(db.Text)  # JSON string of prerequisite course IDs
    department = db.Column(db.String(50), nullable=False)
    difficulty_rating = db.Column(db.Float, default=0.0)
    terms_offered = db.Column(db.String(50))  # Fall, Spring, Summer
    
    # Relationships
    enrollments = db.relationship('Enrollment', backref='course', lazy=True)
    academic_plans = db.relationship('AcademicPlan', backref='course', lazy=True)

class Term(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term_name = db.Column(db.String(50), nullable=False)  # Fall 2024, Spring 2025
    year = db.Column(db.Integer, nullable=False)
    season = db.Column(db.String(20), nullable=False)  # Fall, Spring, Summer
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    
    # Relationships
    enrollments = db.relationship('Enrollment', backref='term', lazy=True)
    academic_plans = db.relationship('AcademicPlan', backref='planned_term', lazy=True)

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    term_id = db.Column(db.Integer, db.ForeignKey('term.id'), nullable=False)
    grade = db.Column(db.String(5))  # A, B, C, D, F, W, I
    status = db.Column(db.String(20), default='enrolled')  # enrolled, completed, dropped
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)

class AcademicPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    planned_term_id = db.Column(db.Integer, db.ForeignKey('term.id'), nullable=False)
    plan_status = db.Column(db.String(20), default='planned')  # planned, enrolled, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
