import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Optional

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from jose import JWTError, jwt
from seed_data import seed_courses
from database import SessionLocal, engine
import models
import crud
from fastapi import FastAPI, Depends, HTTPException, status, Form, Body
from datetime import datetime, timedelta
import uuid

from schemas import UserStats, ComplianceData, CertificateResponse, EnrollmentResponse

# ====================================================
# 🔐 SECURITY CONFIG
# ====================================================

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ====================================================
# 📦 DATABASE SETUP
# ====================================================

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ====================================================
# 🔐 SECURITY FUNCTIONS
# ====================================================

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify plain password against hashed password
    ✅ HANDLES BOTH bcrypt hashes AND plain text (for migration)
    """
    try:
        # Try bcrypt verification first
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        # If bcrypt fails, try plain text comparison (for old data)
        print(f"⚠️  Bcrypt verification failed: {e}")
        print(f"⚠️  Attempting plain text comparison...")
        is_match = plain_password == hashed_password
        if is_match:
            print(f"✅ Plain text password matched (old data)")
        return is_match


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# ====================================================
# ⚙️ FASTAPI APP CONFIG
# ====================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 FastAPI server starting...")

    # Seed courses on startup
    db = SessionLocal()
    try:
        print("📚 Seeding courses into database...")
        seed_courses(db)
        print("✅ Database seeding completed")
    except Exception as e:
        print(f"⚠️  Error during seeding: {e}")
    finally:
        db.close()

    yield

    print("🛑 FastAPI server shutting down...")

app = FastAPI(title="River Garden API", lifespan=lifespan)

# ✅ CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_token(token: str, db: Session):
    """
    Verify JWT token and return user
    Raises HTTPException if token is invalid or user not found
    """
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            print(f"❌ [TOKEN] No email in token payload")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        print(f"✅ [TOKEN] Token decoded successfully, email: {email}")

    except JWTError as e:
        print(f"❌ [TOKEN] JWT decode error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    user = crud.get_user_by_email(db, email=email)

    if user is None:
        print(f"❌ [TOKEN] User not found: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    print(f"✅ [TOKEN] User verified: {user.email}, Role: {user.role}")
    return user

# ====================================================
# 🧩 REGISTER (SIGN UP)
# ====================================================

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Return the currently authenticated user."""
    return verify_token(token, db)

@app.post("/api/auth/register")
def register(
        name: str = Form(...),
        email: str = Form(...),
        password: str = Form(...),
        role: str = Form(...),
        branch: Optional[str] = Form(None),
        db: Session = Depends(get_db)
):
    """
    Register a new user
    """

    print(f"📝 [REGISTER] Received request: name={name}, email={email}, role={role}")

    try:
        # ✅ Check if user already exists
        existing_user = crud.get_user_by_email(db, email=email)
        if existing_user:
            print(f"❌ [REGISTER] Email already exists: {email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # ✅ Hash password with bcrypt
        hashed_password = hash_password(password)
        print(f"✅ [REGISTER] Password hashed successfully")

        # ✅ Create new user
        new_user = models.User(
            name=name,
            email=email,
            password_hash=hashed_password,
            role=role,
            branch=branch
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print(f"✅ [REGISTER] User created successfully: ID={new_user.id}, Email={new_user.email}")

        response = {
            "message": "✅ User registered successfully",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "role": new_user.role
            }
        }

        print(f"✅ [REGISTER] Sending response: {response}")
        return response

    except HTTPException as e:
        print(f"❌ [REGISTER] HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ [REGISTER] Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )


# ====================================================
# 🔑 LOGIN
# ====================================================

@app.post("/api/auth/login")
def login(
        email: str = Form(...),
        password: str = Form(...),
        db: Session = Depends(get_db)
):
    """
    Login user and return JWT token
    ✅ Handles both new bcrypt passwords and old plain text passwords
    """

    print(f"🔑 [LOGIN] Received request: email={email}")

    try:
        # ✅ Find user by email
        db_user = crud.get_user_by_email(db, email=email)

        if not db_user:
            print(f"❌ [LOGIN] User not found: {email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # ✅ Verify password (handles both bcrypt and plain text)
        if not verify_password(password, db_user.password_hash):
            print(f"❌ [LOGIN] Password incorrect for: {email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        print(f"✅ [LOGIN] Password verified for: {email}")

        # ✅ Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email},
            expires_delta=access_token_expires
        )

        response = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "email": db_user.email,
                "name": db_user.name,
                "role": db_user.role,
            }
        }

        print(f"✅ [LOGIN] Token created and sending response")
        return response

    except HTTPException as e:
        print(f"❌ [LOGIN] HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ [LOGIN] Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )


# ====================================================
# 📚 GET COURSES FILTERED BY USER ROLE
# ====================================================

@app.get("/api/courses")
def get_courses(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """
    Get courses assigned to the user's role
    - Carers see: Safeguarding, Infection Control, Fire Safety, Moving & Handling, Medication, etc.
    - Nurses see: All + Clinical Skills
    - Team Leaders see: Supervision, Incident Reporting, etc.
    - Admins see: All courses
    """
    try:
        print("📚 [COURSES] Fetching courses for user role...")

        user = verify_token(token, db)
        print(f"✅ [COURSES] User verified: {user.email}, Role: {user.role}")

        # Get all courses
        all_courses = db.query(models.Course).all()
        print(f"📚 [COURSES] Total courses in database: {len(all_courses)}")

        # Filter courses by user's role
        user_courses = []
        for course in all_courses:
            # Check if user's role is in assigned_roles
            if user.role in course.assigned_roles:
                user_courses.append(course)
                print(f"✅ [COURSES] Adding course '{course.title}' for role {user.role}")
            else:
                print(f"⏭️  [COURSES] Skipping course '{course.title}' (not assigned to {user.role})")

        print(f"✅ [COURSES] User has {len(user_courses)} assigned courses")

        # Convert to dict for JSON response
        courses_data = [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "category": c.category.value if hasattr(c.category, 'value') else str(c.category),
                "difficulty": c.difficulty.value if hasattr(c.difficulty, 'value') else str(c.difficulty),
                "duration": c.duration,
                "modules": c.modules,
                "thumbnail": c.thumbnail,
                "expiry_days": c.expiry_days,
                "assigned_roles": c.assigned_roles,
                "video_url": c.video_url,
            }
            for c in user_courses
        ]

        print(f"✅ [COURSES] Returning {len(courses_data)} courses")
        return courses_data

    except HTTPException as e:
        print(f"❌ [COURSES] Auth error: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ [COURSES] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching courses: {str(e)}"
        )


# ====================================================
# 👥 TEAM API - GET TEAM MEMBERS
# ====================================================

@app.get("/api/team/members")
def get_team_members(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """
    Get all team members for the current manager/supervisor
    Only Team Leaders and Care Managers can see their team
    """
    try:
        print("👥 [TEAM] Fetching team members...")

        user = verify_token(token, db)

        # Check if user is a manager/supervisor
        allowed_roles = ["Team Leader", "Care Manager", "Admin", "Director"]
        if user.role not in allowed_roles:
            print(f"❌ [TEAM] Unauthorized: {user.role} cannot view team")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only managers can view team members"
            )

        print(f"✅ [TEAM] User authorized: {user.role}")

        # Get team members (users managed by this person)
        team_members = db.query(models.User).filter(
            models.User.manager_id == user.id
        ).all()

        print(f"✅ [TEAM] Found {len(team_members)} team members")

        members_data = [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "role": m.role.value if hasattr(m.role, 'value') else str(m.role),
                "branch": m.branch,
                "avatar": m.avatar,
                "join_date": m.join_date.isoformat() if m.join_date else None,
            }
            for m in team_members
        ]

        return members_data

    except HTTPException as e:
        print(f"❌ [TEAM] Error: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ [TEAM] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching team members: {str(e)}"
        )


# ====================================================
# 👥 GET TEAM MEMBER DETAILS
# ====================================================

@app.get("/api/team/members/{member_id}")
def get_team_member(
        member_id: int,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """Get details of a specific team member"""
    try:
        print(f"👥 [TEAM] Fetching member {member_id}...")

        user = verify_token(token, db)

        allowed_roles = ["Team Leader", "Care Manager", "Admin", "Director"]
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only managers can view team members"
            )

        member = db.query(models.User).filter(models.User.id == member_id).first()

        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team member not found"
            )

        return {
            "id": member.id,
            "name": member.name,
            "email": member.email,
            "role": member.role.value if hasattr(member.role, 'value') else str(member.role),
            "branch": member.branch,
            "avatar": member.avatar,
            "join_date": member.join_date.isoformat() if member.join_date else None,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching team member: {str(e)}"
        )


# ====================================================
# 📊 GET TEAM STATS
# ====================================================

@app.get("/api/stats/team")
def get_team_stats(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """Get team statistics for managers"""
    try:
        print("📊 [TEAM STATS] Fetching team stats...")

        user = verify_token(token, db)

        allowed_roles = ["Team Leader", "Care Manager", "Admin", "Director"]
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only managers can view team stats"
            )

        # Get team members
        team_members = db.query(models.User).filter(
            models.User.manager_id == user.id
        ).all()

        team_size = len(team_members)

        # Calculate compliance stats
        total_enrollments = 0
        completed_enrollments = 0
        overdue_enrollments = 0
        total_hours = 0

        for member in team_members:
            enrollments = db.query(models.Enrollment).filter(
                models.Enrollment.user_id == member.id
            ).all()

            total_enrollments += len(enrollments)
            completed_enrollments += len([e for e in enrollments if e.status == models.EnrollmentStatus.COMPLETED])
            overdue_enrollments += len([e for e in enrollments if e.status == models.EnrollmentStatus.OVERDUE])
            total_hours += len([e for e in enrollments if e.status == models.EnrollmentStatus.COMPLETED])

        avg_compliance = (completed_enrollments / total_enrollments * 100) if total_enrollments > 0 else 0

        stats = {
            "team_size": team_size,
            "avg_compliance": round(avg_compliance),
            "total_hours": total_hours,
            "overdue_count": overdue_enrollments,
        }

        print(f"✅ [TEAM STATS] Stats: {stats}")
        return stats

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"❌ [TEAM STATS] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching team stats: {str(e)}"
        )


# ====================================================
# 📝 GET TEAM MEMBER ENROLLMENTS
# ====================================================

@app.get("/api/team/members/{member_id}/enrollments")
def get_member_enrollments(
        member_id: int,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """Get enrollments for a specific team member"""
    try:
        print(f"📝 [TEAM] Fetching enrollments for member {member_id}...")

        user = verify_token(token, db)

        allowed_roles = ["Team Leader", "Care Manager", "Admin", "Director"]
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only managers can view team member enrollments"
            )

        enrollments = db.query(models.Enrollment).filter(
            models.Enrollment.user_id == member_id
        ).all()

        enrollments_data = [
            {
                "id": e.id,
                "course_id": e.course_id,
                "status": e.status.value if hasattr(e.status, 'value') else str(e.status),
                "progress": e.progress,
                "score": e.score,
            }
            for e in enrollments
        ]

        return enrollments_data

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching member enrollments: {str(e)}"
        )


# ====================================================
# 🎓 ASSIGN COURSE TO TEAM MEMBER
# ====================================================

@app.post("/api/team/members/{member_id}/assign-course")
def assign_course_to_member(
        member_id: int,
        course_id: int = Form(...),
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """Assign a course to a team member"""
    try:
        print(f"🎓 [ASSIGN] Assigning course {course_id} to member {member_id}...")

        user = verify_token(token, db)

        allowed_roles = ["Team Leader", "Care Manager", "Admin", "Director"]
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only managers can assign courses"
            )

        # Check if member exists
        member = db.query(models.User).filter(models.User.id == member_id).first()
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team member not found"
            )

        # Check if course exists
        course = db.query(models.Course).filter(models.Course.id == course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )

        # Check if already enrolled
        existing = db.query(models.Enrollment).filter(
            models.Enrollment.user_id == member_id,
            models.Enrollment.course_id == course_id
        ).first()

        if existing:
            print(f"⚠️  [ASSIGN] Already enrolled")
            return {"message": "Member already enrolled in this course"}

        # Create enrollment
        enrollment = models.Enrollment(
            user_id=member_id,
            course_id=course_id,
            status=models.EnrollmentStatus.NOT_STARTED,
            assigned_by=user.id
        )

        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

        print(f"✅ [ASSIGN] Course assigned successfully")
        return {"message": "Course assigned successfully", "enrollment_id": enrollment.id}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"❌ [ASSIGN] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error assigning course: {str(e)}"
        )


# ====================================================
# 📢 SEND REMINDERS TO TEAM
# ====================================================

@app.post("/api/team/send-reminders")
def send_team_reminders(
        member_ids: list = [],
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """Send training reminders to team members"""
    try:
        print(f"📢 [REMINDERS] Sending reminders...")

        user = verify_token(token, db)

        allowed_roles = ["Team Leader", "Care Manager", "Admin", "Director"]
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only managers can send reminders"
            )

        # TODO: Implement email/SMS reminder logic here
        # For now, just return success

        print(f"✅ [REMINDERS] Reminders sent to {len(member_ids)} members")
        return {"message": "Reminders sent successfully", "count": len(member_ids)}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"❌ [REMINDERS] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error sending reminders: {str(e)}"
        )
# ====================================================
# 👑 ADMIN: GET ALL USERS (for Assign/Unassign Supervisor)
# ====================================================

@app.get("/api/admin/all-users")
def get_all_users_for_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Return all users in the system (Admin only)
    Used for Assign/Unassign Supervisor dropdowns
    """
    user = verify_token(token, db)

    # Only Admins can call this
    if user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can view all users"
        )

    users = db.query(models.User).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "branch": u.branch,
            "avatar": getattr(u, "avatar", None)
        }
        for u in users
    ]

@app.post("/api/admin/assign-supervisor")
def assign_supervisor_api(supervisor_id: int = Form(...), member_id: int = Form(...),
                          db: Session = Depends(get_db)):
    """Admin assigns a supervisor to a team member"""
    assignment = crud.assign_supervisor(db, supervisor_id, member_id)
    return {"message": "Supervisor assigned", "assignment_id": assignment.id}

@app.post("/api/admin/unassign-supervisor")
def unassign_supervisor_api(supervisor_id: int = Form(...), member_id: int = Form(...),
                            db: Session = Depends(get_db)):
    """Admin unassigns a supervisor from a team member"""
    success = crud.unassign_supervisor(db, supervisor_id, member_id)
    if success:
        return {"message": "Unassigned successfully"}
    raise HTTPException(status_code=404, detail="Assignment not found")

@app.get("/api/supervisor/team")
def get_supervisor_team(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Supervisors view their assigned team"""
    user = verify_token(token, db)
    team = crud.get_team_for_supervisor(db, user.id)
    return [
        {"id": m.id, "name": m.name, "email": m.email, "role": m.role, "branch": m.branch}
        for m in team
    ]
# ====================================================
# 📚 USER ENROLLMENTS
# ====================================================

@app.get("/api/enrollments")
def get_my_enrollments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Return all enrollments for the logged-in user."""
    enrollments = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id
    ).all()
    return enrollments


@app.post("/api/enrollments/enroll")
def enroll_in_course(
    course_id: int = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enroll the current user in a course (if not already)."""
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()

    if enrollment:
        return {"message": "Already enrolled", "enrollment_id": enrollment.id}

    enrollment = models.Enrollment(
        user_id=current_user.id,
        course_id=course_id,
        status=models.EnrollmentStatus.NOT_STARTED,
        progress=0,
        started_date=None,
        completed_date=None,
        due_date=datetime.utcnow() + timedelta(days=course.expiry_days),
        assigned_by=None,
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return {"message": "Enrolled successfully", "enrollment_id": enrollment.id}

@app.post("/api/enrollments/{course_id}/progress")
def update_progress(
    course_id: int,
    payload: dict = Body(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update progress for a course.
    Body: { "progress": 0-100 }
    """
    progress = int(payload.get("progress", 0))

    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()

    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    # Update status/progress
    if enrollment.status == models.EnrollmentStatus.NOT_STARTED and progress > 0:
        enrollment.status = models.EnrollmentStatus.IN_PROGRESS

    enrollment.progress = max(enrollment.progress, progress)
    enrollment.updated_at = datetime.utcnow()

    # Auto-complete when 100%
    if enrollment.progress >= 100 and enrollment.status != models.EnrollmentStatus.COMPLETED:
        enrollment.status = models.EnrollmentStatus.COMPLETED
        enrollment.completed_date = datetime.utcnow()

        # Create certificate if not exists
        existing_cert = db.query(models.Certificate).filter(
            models.Certificate.user_id == current_user.id,
            models.Certificate.course_id == course_id
        ).first()

        if not existing_cert:
            course = enrollment.course
            expiry_date = datetime.utcnow() + timedelta(days=course.expiry_days)
            cert = models.Certificate(
                certificate_id=str(uuid.uuid4()),
                user_id=current_user.id,
                course_id=course_id,
                score=enrollment.score or 100.0,
                expiry_date=expiry_date,
                qr_code=None,
            )
            db.add(cert)

    db.commit()
    return {"message": "Progress updated", "progress": enrollment.progress, "status": enrollment.status.value}


@app.post("/api/enrollments/{course_id}/complete")
def mark_course_complete(
    course_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Force-complete a course and create certificate (if needed)."""
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()

    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    course = enrollment.course

    enrollment.status = models.EnrollmentStatus.COMPLETED
    enrollment.progress = 100
    enrollment.completed_date = datetime.utcnow()
    enrollment.updated_at = datetime.utcnow()

    existing_cert = db.query(models.Certificate).filter(
        models.Certificate.user_id == current_user.id,
        models.Certificate.course_id == course_id
    ).first()

    if not existing_cert:
        expiry_date = datetime.utcnow() + timedelta(days=course.expiry_days)
        cert = models.Certificate(
            certificate_id=str(uuid.uuid4()),
            user_id=current_user.id,
            course_id=course_id,
            score=enrollment.score or 100.0,
            expiry_date=expiry_date,
            qr_code=None,
        )
        db.add(cert)

    db.commit()
    return {"message": "Course marked complete"}
# ====================================================
# 🎓 USER CERTIFICATES
# ====================================================

@app.get("/api/certificates/me")
def get_my_certificates(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    certificates = db.query(models.Certificate).filter(
        models.Certificate.user_id == current_user.id
    ).all()

    # Attach human-friendly course/user names
    result = []
    for cert in certificates:
        item = CertificateResponse.from_orm(cert)
        item.course_name = cert.course.title if cert.course else None
        item.user_name = current_user.name
        result.append(item)

    return result
# ====================================================
# 📊 USER STATS & COMPLIANCE
# ====================================================

@app.get("/api/stats/me")
def get_user_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    enrollments = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id
    ).all()

    total_courses = len(enrollments)
    completed = len([e for e in enrollments if e.status == models.EnrollmentStatus.COMPLETED])
    in_progress = len([e for e in enrollments if e.status == models.EnrollmentStatus.IN_PROGRESS])
    overdue = len([e for e in enrollments if e.status == models.EnrollmentStatus.OVERDUE])

    compliance_rate = (completed / total_courses * 100) if total_courses > 0 else 0.0

    # For MVP: each completed enrollment = 1h
    total_hours = completed

    # Avg score
    scores = [e.score for e in enrollments if e.score is not None]
    avg_score = sum(scores) / len(scores) if scores else 0.0

    return UserStats(
        total_courses=total_courses,
        completed_courses=completed,
        in_progress=in_progress,
        overdue=overdue,
        compliance_rate=round(compliance_rate, 1),
        avg_score=round(avg_score, 1),
        total_hours=total_hours,
    )


@app.get("/api/stats/compliance-trend")
def get_compliance_trend(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simple 6-month trend. For now we just generate dummy data based
    on current compliance.
    """
    stats = get_user_stats(current_user=current_user, db=db)

    data = []
    now = datetime.utcnow()
    base = stats.compliance_rate

    for i in range(5, -1, -1):
        month = (now - timedelta(days=30 * i)).strftime("%b %Y")
        # small variation
        rate = max(0.0, min(100.0, base + (i - 3) * 3))
        data.append(ComplianceData(month=month, rate=round(rate, 1)))

    return data

# ====================================================
# ✅ ROOT CHECK
# ====================================================

@app.get("/")
def root():
    print("✅ [ROOT] Health check")
    return {
        "message": "✅ River Garden API running with PostgreSQL",
        "version": "1.0",
        "auth": "JWT Bearer Token"
    }


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Starting FastAPI Server on port 5000...")
    print("=" * 60)
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )