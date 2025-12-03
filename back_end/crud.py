from sqlalchemy.orm import Session
import models


# ====================================================
# 👤 USER OPERATIONS
# ====================================================

def get_user_by_email(db: Session, email: str):
    """Get user by email"""
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    """Get user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, name: str, email: str, password_hash: str, role: str , branch: str = None):
    """Create a new user"""
    db_user = models.User(
        name=name,
        email=email,
        password_hash=password_hash,
        role=role,
        branch=branch
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_all_users(db: Session):
    """Get all users"""
    return db.query(models.User).all()


# ====================================================
# 📚 COURSE OPERATIONS
# ====================================================

def get_course_by_id(db: Session, course_id: int):
    """Get course by ID"""
    return db.query(models.Course).filter(models.Course.id == course_id).first()


def get_all_courses(db: Session):
    """Get all courses"""
    return db.query(models.Course).all()


def create_course(db: Session, title: str, description: str, category: str, difficulty: str, duration: str,
                  modules: int = 1, expiry_days: int = 365):
    """Create a new course"""
    db_course = models.Course(
        title=title,
        description=description,
        category=category,
        difficulty=difficulty,
        duration=duration,
        modules=modules,
        expiry_days=expiry_days
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


# ====================================================
# 📝 ENROLLMENT OPERATIONS
# ====================================================

def create_enrollment(db: Session, user_id: int, course_id: int, due_date=None, assigned_by=None):
    """Create an enrollment"""
    db_enrollment = models.Enrollment(
        user_id=user_id,
        course_id=course_id,
        due_date=due_date,
        assigned_by=assigned_by
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment


def get_user_enrollments(db: Session, user_id: int):
    """Get all enrollments for a user"""
    return db.query(models.Enrollment).filter(models.Enrollment.user_id == user_id).all()


def update_enrollment(db: Session, enrollment_id: int, status=None, progress=None, score=None):
    """Update enrollment details"""
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()
    if not enrollment:
        return None

    if status:
        enrollment.status = status
    if progress is not None:
        enrollment.progress = progress
    if score is not None:
        enrollment.score = score

    db.commit()
    db.refresh(enrollment)
    return enrollment


# ====================================================
# 🏆 CERTIFICATE OPERATIONS
# ====================================================

def create_certificate(db: Session, certificate_id: str, user_id: int, course_id: int, expiry_date, score: float,
                       qr_code: str = None):
    """Create a certificate"""
    db_certificate = models.Certificate(
        certificate_id=certificate_id,
        user_id=user_id,
        course_id=course_id,
        expiry_date=expiry_date,
        score=score,
        qr_code=qr_code
    )
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    return db_certificate


def get_user_certificates(db: Session, user_id: int):
    """Get all certificates for a user"""
    return db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()


# ====================================================
# 🔔 NOTIFICATION OPERATIONS
# ====================================================

def create_notification(db: Session, user_id: int, title: str, message: str, notification_type: str):
    """Create a notification"""
    db_notification = models.Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def get_user_notifications(db: Session, user_id: int, unread_only: bool = False):
    """Get notifications for a user"""
    query = db.query(models.Notification).filter(models.Notification.user_id == user_id)
    if unread_only:
        query = query.filter(models.Notification.read == False)
    return query.all()

def assign_supervisor(db: Session, supervisor_id: int, member_id: int):
    """Assign a supervisor to a team member"""
    existing = db.query(models.AssignedSupervisor).filter_by(
        supervisor_id=supervisor_id, member_id=member_id
    ).first()
    if existing:
        return existing
    assignment = models.AssignedSupervisor(
        supervisor_id=supervisor_id,
        member_id=member_id
    )
    db.add(assignment)
    member = db.query(models.User).filter(models.User.id == member_id).first()
    if member:
        member.manager_id = supervisor_id
        db.commit()
    db.commit()
    db.refresh(assignment)
    return assignment


def unassign_supervisor(db: Session, supervisor_id: int, member_id: int):
    """Remove assignment"""
    assignment = db.query(models.AssignedSupervisor).filter_by(
        supervisor_id=supervisor_id, member_id=member_id
    ).first()
    if assignment:
        db.delete(assignment)
        db.commit()
        return True
    return False


def get_team_for_supervisor(db: Session, supervisor_id: int):
    """Get all team members assigned to a supervisor"""
    assignments = db.query(models.AssignedSupervisor).filter_by(supervisor_id=supervisor_id).all()
    member_ids = [a.member_id for a in assignments]
    return db.query(models.User).filter(models.User.id.in_(member_ids)).all()
