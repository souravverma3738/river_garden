from sqlalchemy.orm import Session
from models import Course, CourseCategory, CourseDifficulty, CourseDeliveryType


def seed_courses(db: Session):
    """Seed courses with role-based assignments"""
    if db.query(Course).count() > 0:
        print("✅ Courses already exist – skipping seed.")
        return

    courses_data = [

        # ============================
        # 🔵 ALL STAFF
        # ============================
        {
            "title": "Safeguarding Adults",
            "category": CourseCategory.MANDATORY,
            "duration": "45 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Protecting vulnerable adults from abuse, harm or neglect.",
            "modules": 5,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver","Admin"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },
        {
            "title": "GDPR & Data Protection",
            "category": CourseCategory.MANDATORY,
            "duration": "35 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Understanding GDPR, confidentiality and secure data handling.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver","Admin"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Fire Safety",
            "category": CourseCategory.MANDATORY,
            "duration": "25 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Recognising fire risks, using extinguishers and emergency evacuation.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver","Admin"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Infection Control",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "PPE use, hand hygiene, preventing infection spread.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver","Admin"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Health & Safety Awareness",
            "category": CourseCategory.MANDATORY,
            "duration": "40 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Workplace safety, hazard reporting and risk prevention.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver","Admin"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Complaints Handling",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Responding to complaints professionally and following procedures.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            "assigned_roles": ["Carer", "Office Staff", "Nurse", "Supervisor", "Driver","Admin"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        # ============================
        # 🟢 CARERS
        # ============================
        {
            "title": "Moving & Handling",
            "category": CourseCategory.MANDATORY,
            "duration": "60 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Safe techniques for moving clients and using equipment.",
            "modules": 5,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            "assigned_roles": ["Carer"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Medication Awareness",
            "category": CourseCategory.MANDATORY,
            "duration": "50 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Understanding medication types, refusals and documentation.",
            "modules": 4,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            "assigned_roles": ["Carer"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Food Hygiene",
            "category": CourseCategory.MANDATORY,
            "duration": "40 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Preventing contamination, safe food preparation and storage.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            "assigned_roles": ["Carer"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Lone Working",
            "category": CourseCategory.MANDATORY,
            "duration": "30 mins",
            "difficulty": CourseDifficulty.BEGINNER,
            "description": "Staying safe when working alone in the community.",
            "modules": 3,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            "assigned_roles": ["Carer", "Driver"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        # ============================
        # 🟣 NURSES
        # ============================
        {
            "title": "Clinical Skills",
            "category": CourseCategory.SPECIALIST,
            "duration": "90 mins",
            "difficulty": CourseDifficulty.ADVANCED,
            "description": "Advanced assessments, vitals monitoring and clinical judgement.",
            "modules": 8,
            "expiry_days": 180,
            "thumbnail": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            "assigned_roles": ["Nurse"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Medication Administration",
            "category": CourseCategory.SPECIALIST,
            "duration": "70 mins",
            "difficulty": CourseDifficulty.ADVANCED,
            "description": "Safe medication delivery and MAR chart accuracy.",
            "modules": 5,
            "expiry_days": 180,
            "thumbnail": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            "assigned_roles": ["Nurse"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
        },

        {
            "title": "Pressure Care",
            "category": CourseCategory.SPECIALIST,
            "duration": "45 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Identifying pressure ulcers and implementing prevention plans.",
            "modules": 4,
            "expiry_days": 180,
            "thumbnail": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            "assigned_roles": ["Nurse"],
            "delivery_type": CourseDeliveryType.VIDEO,
            "meeting_url": None,
            "meeting_platform": None,
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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
            "thumbnail": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
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
            "thumbnail": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
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
            "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            "assigned_roles": ["Carer", "Nurse"],
        },
        # ============================
        # LIVE SESSION EXAMPLES
        # ============================
        {
            "title": "Live Q&A: Dementia Care Best Practices",
            "category": CourseCategory.SPECIALIST,
            "duration": "60 mins",
            "difficulty": CourseDifficulty.INTERMEDIATE,
            "description": "Join our expert-led live session on dementia care. Interactive Q&A included.",
            "modules": 1,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
            "video_url": None,
            "assigned_roles": ["Carer", "Nurse", "Supervisor"],
            "delivery_type": CourseDeliveryType.LIVE_SESSION,
            "meeting_url": "https://zoom.us/j/1234567890",
            "meeting_platform": "Zoom",
        },

        {
            "title": "Team Leadership Workshop",
            "category": CourseCategory.ADVANCED,
            "duration": "90 mins",
            "difficulty": CourseDifficulty.ADVANCED,
            "description": "Interactive workshop on effective team leadership and communication strategies.",
            "modules": 1,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
            "video_url": None,
            "assigned_roles": ["Supervisor"],
            "delivery_type": CourseDeliveryType.LIVE_SESSION,
            "meeting_url": "https://meet.google.com/abc-defg-hij",
            "meeting_platform": "Google Meet",
        },

        {
            "title": "Mental Health First Aid Training",
            "category": CourseCategory.SPECIALIST,
            "duration": "120 mins",
            "difficulty": CourseDifficulty.ADVANCED,
            "description": "Comprehensive live training on mental health support and crisis intervention.",
            "modules": 1,
            "expiry_days": 365,
            "thumbnail": "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80",
            "video_url": None,
            "assigned_roles": ["Carer", "Nurse", "Supervisor"],
            "delivery_type": CourseDeliveryType.LIVE_SESSION,
            "meeting_url": "https://teams.microsoft.com/l/meetup-join/example",
            "meeting_platform": "Microsoft Teams",
        },
    ]

    for data in courses_data:
        course = Course(**data)
        db.add(course)

    db.commit()
    print(f"✅ Seeded {len(courses_data)} courses with verified working images and role assignments!")
