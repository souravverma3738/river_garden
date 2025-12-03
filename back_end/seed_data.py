from sqlalchemy.orm import Session
from models import Course, CourseCategory, CourseDifficulty
from datetime import datetime


def seed_courses(db: Session):
    """Seed courses with role-based assignments"""
    if db.query(Course).count() > 0:
        print("✅ Courses already exist – skipping seed.")
        return

    # Define which roles should have access to each course
    courses_data = [

        # ============================
        # 🔵 ALL STAFF (12 months)
        # ============================
        {
            "title": "Safeguarding Adults",
            "category": CourseCategory.MANDATORY,
            "duration": "45 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Protecting vulnerable adults from abuse, harm or neglect.",
            "modules": 5,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1584438784894-089d6a62b8d5?w=400",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver"],
        },
        {
            "title": "GDPR & Data Protection",
            "category": CourseCategory.MANDATORY,
            "duration": "35 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Understanding GDPR, confidentiality and secure data handling.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver"],
        },
        {
            "title": "Fire Safety",
            "category": CourseCategory.MANDATORY,
            "duration": "25 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Recognising fire risks, using extinguishers and emergency evacuation.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1598387993411-5d5a06d0c7cc?w=400",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver"],
        },
        {
            "title": "Infection Control",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "PPE use, hand hygiene, preventing infection spread.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1580983557125-27b3b36e5a2e?w=400",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver"],
        },
        {
            "title": "Health & Safety Awareness",
            "category": CourseCategory.MANDATORY,
            "duration": "40 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Workplace safety, hazard reporting and risk prevention.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1556911220-e15b29be8c83?w=400",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver"],
        },
        {
            "title": "Complaints Handling",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Responding to complaints professionally and following procedures.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1605902711622-cfb43c44367d?w=400",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver"],
        },

        # ============================
        # 🟢 CARERS (12 months)
        # ============================
        {
            "title": "Moving & Handling",
            "category": CourseCategory.MANDATORY,
            "duration": "60 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Safe techniques for moving clients and using equipment.",
            "modules": 5,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400",
            "assigned_roles": ["Carer"],
        },
        {
            "title": "Medication Awareness",
            "category": CourseCategory.MANDATORY,
            "duration": "50 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Understanding medication types, refusals and documentation.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1580281658624-7f6f729bb1c7?w=400",
            "assigned_roles": ["Carer"],
        },
        {
            "title": "Food Hygiene",
            "category": CourseCategory.MANDATORY,
            "duration": "40 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Preventing contamination, safe food preparation and storage.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
            "assigned_roles": ["Carer"],
        },
        {
            "title": "Lone Working",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Staying safe when working alone in the community.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1521790361543-f645cf042ec4?w=400",
            "assigned_roles": ["Carer", "Driver"],
        },

        # ============================
        # 🟣 NURSES (6 months)
        # ============================
        {
            "title": "Clinical Skills",
            "category": CourseCategory.SPECIALIST,
            "duration": "90 mins",
            "difficulty": CourseDifficulty.ADVANCED,
            "description": "Advanced assessments, vitals monitoring and clinical judgement.",
            "modules": 8,
            "expiry_days": 180,
            "thumbnail": "https://images.unsplash.com/photo-1580281658624-7f6f729bb1c7?w=400",
            "assigned_roles": ["Nurse"],
        },
        {
            "title": "Medication Administration",
            "category": CourseCategory.SPECIALIST,
            "duration": "70 mins",
            "difficulty": CourseDifficulty.ADVANCED,
            "description": "Safe medication delivery and MAR chart accuracy.",
            "modules": 5,
            "expiry_days": 180,
            "thumbnail": "https://images.unsplash.com/photo-1580281656219-ee3e6db031ff?w=400",
            "assigned_roles": ["Nurse"],
        },
        {
            "title": "Pressure Care",
            "category": CourseCategory.SPECIALIST,
            "duration": "45 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Identifying pressure ulcers and implementing prevention plans.",
            "modules": 4,
            "expiry_days": 180,
            "thumbnail": "https://images.unsplash.com/photo-1580281658940-e418f3802c30?w=400",
            "assigned_roles": ["Nurse"],
        },

        # ============================
        # 🟠 SUPERVISORS (12 months)
        # ============================
        {
            "title": "Staff Supervision",
            "category": CourseCategory.MANDATORY,
            "duration": "40 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Effective leadership, mentoring and staff performance management.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
            "assigned_roles": ["Supervisor"],
        },
        {
            "title": "Incident Reporting",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Identifying, documenting and reporting incidents correctly.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
            "assigned_roles": ["Supervisor"],
        },
        {
            "title": "Risk Management",
            "category": CourseCategory.MANDATORY,
            "duration": "45 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Assessing risks and creating safe working environments.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
            "assigned_roles": ["Supervisor"],
        },

        # ============================
        # 🟡 DRIVERS (12 months)
        # ============================
        {
            "title": "First Aid",
            "category": CourseCategory.SPECIALIST,
            "duration": "60 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Basic first aid response including CPR awareness.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1576765975876-8c9c0a4a79e4?w=400",
            "assigned_roles": ["Driver"],
        },
        {
            "title": "Safe Transport",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Transporting clients safely while following policy.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400",
            "assigned_roles": ["Driver"],
        },

        # ============================
        # 🟤 OFFICE STAFF (24 months)
        # ============================
        {
            "title": "Confidentiality",
            "category": CourseCategory.MANDATORY,
            "duration": "25 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Maintaining privacy for clients, staff and company data.",
            "modules": 3,
            "expiry_days": 730,
            "thumbnail": "https://images.unsplash.com/photo-1515169067865-5387d99f67a6?w=400",
            "assigned_roles": ["Office Staff"],
        },
        {
            "title": "Customer Service",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Communication, professionalism and responding to enquiries.",
            "modules": 3,
            "expiry_days": 730,
            "thumbnail": "https://images.unsplash.com/photo-1560264418-c4445382edbc?w=400",
            "assigned_roles": ["Office Staff"],
        },

        # ============================
        # 📝 EXTRA TRAINING FROM YOUR PDFs
        # ============================
        {
            "title": "Documentation Training",
            "category": CourseCategory.MANDATORY,
            "duration": "20 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "How to document clearly, legally and accurately.",
            "modules": 1,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
            "assigned_roles": ["Carer", "Nurse", "Supervisor"],
        },
        {
            "title": "MASD Awareness",
            "category": CourseCategory.MANDATORY,
            "duration": "25 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Recognising and preventing moisture-associated skin damage.",
            "modules": 1,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1580281656219-ee3e6db031ff?w=400",
            "assigned_roles": ["Carer", "Nurse"],
        },
        {
            "title": "Medication Support",
            "category": CourseCategory.MANDATORY,
            "duration": "35 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Understanding responsibilities when supporting medication.",
            "modules": 1,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
            "assigned_roles": ["Carer", "Nurse"],
        },
        {
            "title": "Pressure Ulcer Awareness",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Identifying pressure sores and preventing skin breakdown.",
            "modules": 1,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1603398938378-e54eabbb4c59?w=400",
            "assigned_roles": ["Carer", "Nurse"],
        },
    ]
    for data in courses_data:
        course = Course(**data)
        db.add(course)

    db.commit()
    print(f"✅ Seeded {len(courses_data)} courses with role-based assignments successfully!")