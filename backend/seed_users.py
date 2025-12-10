from app.database import SessionLocal, engine, Base
from app.models import User
from sqlalchemy.orm import Session

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def seed_users():
    db: Session = SessionLocal()
    try:
        # Seed Student
        # Using real email for notification testing
        student_email = "premkollepara@gmail.com"
        student = db.query(User).filter(User.email == student_email).first()
        if not student:
            print(f"Creating student: {student_email}")
            student = User(
                name="Prem Student",
                email=student_email,
                password="password123",  # Plain text as per auth.py logic
                role="STUDENT",
                class_name="CS-A"
            )
            db.add(student)
        else:
            print(f"Student {student_email} already exists. Updating password.")
            student.password = "password123"
            student.role = "STUDENT"

        # Seed Faculty
        faculty_email = "faculty@college.com"
        faculty = db.query(User).filter(User.email == faculty_email).first()
        if not faculty:
            print(f"Creating faculty: {faculty_email}")
            faculty = User(
                name="Dr. Faculty",
                email=faculty_email,
                password="password123",
                role="FACULTY"
            )
            db.add(faculty)
        else:
             print(f"Faculty {faculty_email} already exists. Updating password.")
             faculty.password = "password123"
             faculty.role = "FACULTY"

        db.commit()
        print("Done seeding users.")

    except Exception as e:
        print(f"Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
