from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models import UserRole, CourseCategory, CourseDifficulty, EnrollmentStatus


# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = 'Carer'
    branch: Optional[str] = None
    avatar: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    join_date: datetime
    manager_id: Optional[int] = None

    class Config:
        from_attributes = True


# Course Schemas
class CourseBase(BaseModel):
    title: str
    description: str
    category: CourseCategory
    difficulty: CourseDifficulty
    duration: str
    modules: int = 1
    thumbnail: Optional[str] = None
    video_url: Optional[str] = None
    expiry_days: int = 365


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Enrollment Schemas
class EnrollmentBase(BaseModel):
    user_id: int
    course_id: int


class EnrollmentCreate(EnrollmentBase):
    due_date: Optional[datetime] = None
    assigned_by: Optional[int] = None


class EnrollmentUpdate(BaseModel):
    status: Optional[EnrollmentStatus] = None
    progress: Optional[int] = None
    score: Optional[float] = None


class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    status: EnrollmentStatus
    progress: int
    score: Optional[float] = None
    started_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Certificate Schemas
class CertificateResponse(BaseModel):
    id: int
    certificate_id: str
    user_id: int
    course_id: int
    issue_date: datetime
    expiry_date: datetime
    score: float
    qr_code: Optional[str] = None
    course_name: Optional[str] = None
    user_name: Optional[str] = None

    class Config:
        from_attributes = True


# Stats Schemas
class UserStats(BaseModel):
    total_courses: int
    completed_courses: int
    in_progress: int
    overdue: int
    compliance_rate: float
    avg_score: float
    total_hours: int


class TeamStats(BaseModel):
    team_size: int
    avg_compliance: float
    total_hours: int
    overdue_count: int


class ComplianceData(BaseModel):
    month: str
    rate: float


# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse