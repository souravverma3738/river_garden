from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Boolean, Enum as SQLEnum, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class UserRole(str, enum.Enum):
    CARER = "Carer"
    OFFICE_STAFF = "Office Staff"
    NURSE = "Nurse"
    SUPERVISOR = "Supervisor"
    ADMIN = "Admin"
    DRIVER = "Driver"


class CourseCategory(str, enum.Enum):
    MANDATORY = "Mandatory"
    SPECIALIST = "Specialist"
    ADVANCED = "Advanced"
    OPTIONAL = "Optional"


class CourseDifficulty(str, enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class CourseDeliveryType(str, enum.Enum):
    VIDEO = "video"
    LIVE_SESSION = "live_session"


class EnrollmentStatus(str, enum.Enum):
    NOT_STARTED = "not-started"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"


# User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole, native_enum=False), nullable=False)
    branch = Column(String, nullable=True)
    join_date = Column(DateTime, default=datetime.utcnow)
    avatar = Column(String, nullable=True)
    manager_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    last_login = Column(DateTime, nullable=True)  # Track last login time
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    enrollments = relationship("Enrollment", back_populates="user", foreign_keys="[Enrollment.user_id]")
    certificates = relationship("Certificate", back_populates="user")
    team_members = relationship("User", backref="manager", remote_side=[id])

# models.py
class AssignedSupervisor(Base):
    __tablename__ = "assigned_supervisors"

    id = Column(Integer, primary_key=True, index=True)
    supervisor_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    member_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    supervisor = relationship("User", foreign_keys=[supervisor_id])
    member = relationship("User", foreign_keys=[member_id])

# Course Model - NOW WITH ASSIGNED ROLES
class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(SQLEnum(CourseCategory), nullable=False)
    difficulty = Column(SQLEnum(CourseDifficulty), nullable=False)
    duration = Column(String, nullable=False)  # e.g., "45 mins"
    modules = Column(Integer, default=1)
    thumbnail = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    expiry_days = Column(Integer, default=365)

    # NEW: Store which roles this course is assigned to
    assigned_roles = Column(ARRAY(String), default=[], nullable=False)  # e.g., ["Carer", "Support Worker", "Nurse"]

    # NEW: Course delivery type and meeting URL
    delivery_type = Column(SQLEnum(CourseDeliveryType), default=CourseDeliveryType.VIDEO, nullable=False)
    meeting_url = Column(String, nullable=True)  # For Zoom, Google Meet, Teams links
    meeting_platform = Column(String, nullable=True)  # e.g., "Zoom", "Google Meet", "Microsoft Teams"

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    enrollments = relationship("Enrollment", back_populates="course")
    certificates = relationship("Certificate", back_populates="course")


# Enrollment Model
class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    status = Column(SQLEnum(EnrollmentStatus), default=EnrollmentStatus.NOT_STARTED)
    progress = Column(Integer, default=0)  # 0-100
    score = Column(Float, nullable=True)
    started_date = Column(DateTime, nullable=True)
    completed_date = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    assigned_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="enrollments", foreign_keys=[user_id])
    course = relationship("Course", back_populates="enrollments")


# Certificate Model
class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    issue_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(DateTime, nullable=False)
    score = Column(Float, nullable=False)
    qr_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="certificates")
    course = relationship("Course", back_populates="certificates")


# Notification Model
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)