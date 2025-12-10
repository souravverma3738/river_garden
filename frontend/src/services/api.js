// API Base URL
const API_BASE = "http://127.0.0.1:8000";

// Get auth token
const getToken = () => localStorage.getItem("token");

// Get headers with auth token
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`,
});

// ====================================================
// 🔐 AUTH API
// ====================================================

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password }),
    });
    return res.json();
  },

  register: async (name, email, password, role = "Carer", branch = null) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, email, password, role, branch }),
    });
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// ====================================================
// 📚 COURSE API
// ====================================================

export const courseAPI = {
  // Get all courses
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/courses`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      return await res.json();
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  // Get courses by category
  getByCategory: async (category) => {
    try {
      const res = await fetch(`${API_BASE}/api/courses?category=${category}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      return await res.json();
    } catch (error) {
      console.error("Error fetching courses by category:", error);
      return [];
    }
  },

  // Get courses by role
  getByRole: async (role) => {
    try {
      const res = await fetch(`${API_BASE}/api/courses/by-role/${role}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      return await res.json();
    } catch (error) {
      console.error("Error fetching courses by role:", error);
      return [];
    }
  },

  // Get single course
  getById: async (courseId) => {
    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch course");
      return await res.json();
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  },
};

// ====================================================
// 📝 ENROLLMENT API
// ====================================================

// ====================================================
// 📝 ENROLLMENT API (FIXED FOR TRAINING SYSTEM)
// ====================================================

export const enrollmentAPI = {
  async getUserEnrollments() {
    const res = await fetch(`${API_BASE}/api/enrollments`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch enrollments");
    return res.json();
  },

  async enrollCourse(courseId) {
    const form = new URLSearchParams({ course_id: courseId });
    const res = await fetch(`${API_BASE}/api/enrollments/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getToken()}`
      },
      body: form,
    });
    if (!res.ok) throw new Error("Failed to enroll");
    return res.json();
  },

  async updateProgress(courseId, progress) {
    const res = await fetch(`${API_BASE}/api/enrollments/${courseId}/progress`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ progress }),
    });
    if (!res.ok) throw new Error("Failed to update progress");
    return res.json();
  },

  async completeCourse(courseId) {
    const res = await fetch(`${API_BASE}/api/enrollments/${courseId}/complete`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to complete course");
    return res.json();
  },
};


// ====================================================
// 🏆 CERTIFICATE API
// ====================================================

export const certificateAPI = {
  // Get user certificates
  getUserCertificates: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/certificates/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch certificates");
      return await res.json();
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return [];
    }
  },

  // Get certificate by ID
  getById: async (certificateId) => {
    try {
      const res = await fetch(`${API_BASE}/api/certificates/${certificateId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch certificate");
      return await res.json();
    } catch (error) {
      console.error("Error fetching certificate:", error);
      return null;
    }
  },
};

// ====================================================
// 📊 STATS API
// ====================================================

export const statsAPI = {
  // Get user stats
  getUserStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        total_courses: 0,
        completed_courses: 0,
        in_progress: 0,
        overdue: 0,
        compliance_rate: 0,
        avg_score: 0,
        total_hours: 0,
      };
    }
  },

  // Get compliance trend
  getComplianceTrend: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats/compliance-trend`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch compliance trend");
      return await res.json();
    } catch (error) {
      console.error("Error fetching compliance trend:", error);
      return [];
    }
  },

  // Get team stats
  getTeamStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats/team`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch team stats");
      return await res.json();
    } catch (error) {
      console.error("Error fetching team stats:", error);
      return null;
    }
  },
};
// ====================================================
// 👥 TEAM API
// ====================================================

export const teamAPI = {
  // Get team members (for managers/supervisors)
  getMembers: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/team/members`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch team members");
      return await res.json();
    } catch (error) {
      console.error("Error fetching team members:", error);
      return [];
    }
  },

  // Get team member details
  getMemberById: async (memberId) => {
    try {
      const res = await fetch(`${API_BASE}/api/team/members/${memberId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch team member");
      return await res.json();
    } catch (error) {
      console.error("Error fetching team member:", error);
      return null;
    }
  },

  // Get team member's courses/enrollments
  getMemberEnrollments: async (memberId) => {
    try {
      const res = await fetch(`${API_BASE}/api/team/members/${memberId}/enrollments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch member enrollments");
      return await res.json();
    } catch (error) {
      console.error("Error fetching member enrollments:", error);
      return [];
    }
  },

  // Assign course to team member
  assignCourse: async (memberId, courseId) => {
    try {
      const res = await fetch(`${API_BASE}/api/team/members/${memberId}/assign-course`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ course_id: courseId }),
      });
      if (!res.ok) throw new Error("Failed to assign course");
      return await res.json();
    } catch (error) {
      console.error("Error assigning course:", error);
      return null;
    }
  },

  // Send reminders to team
  sendReminders: async (memberIds = []) => {
    try {
      const res = await fetch(`${API_BASE}/api/team/send-reminders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ member_ids: memberIds }),
      });
      if (!res.ok) throw new Error("Failed to send reminders");
      return await res.json();
    } catch (error) {
      console.error("Error sending reminders:", error);
      return null;
    }
  },
};
// ====================================================
// 🧑‍💼 ADMIN API
// ====================================================
export const adminAPI = {
   getAllUsers: async () => {
    const res = await fetch(`${API_BASE}/api/admin/all-users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  },
  assignSupervisor: async (supervisorId, memberId) => {
    const res = await fetch(`${API_BASE}/api/admin/assign-supervisor`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        supervisor_id: supervisorId,
        member_id: memberId,
      }),
    });
    return res.json();
  },

  unassignSupervisor: async (supervisorId, memberId) => {
    const res = await fetch(`${API_BASE}/api/admin/unassign-supervisor`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        supervisor_id: supervisorId,
        member_id: memberId,
      }),
    });
    return res.json();
  },
};

// ====================================================
// 👨‍💼 SUPERVISOR API
// ====================================================
export const supervisorAPI = {
  // Get supervisor's assigned team members
  getMyTeam: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/supervisor/team`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch team");
      return await res.json();
    } catch (error) {
      console.error("Error fetching supervisor team:", error);
      return [];
    }
  },

  // Get member's enrollments with progress
  getMemberEnrollments: async (memberId) => {
    try {
      const res = await fetch(`${API_BASE}/api/supervisor/member/${memberId}/enrollments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch member enrollments");
      return await res.json();
    } catch (error) {
      console.error("Error fetching member enrollments:", error);
      return [];
    }
  },

  // Assign course to team member
  assignCourse: async (memberId, courseId) => {
    try {
      const res = await fetch(`${API_BASE}/api/supervisor/assign-course`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          member_id: memberId,
          course_id: courseId,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to assign course");
      }
      return await res.json();
    } catch (error) {
      console.error("Error assigning course:", error);
      throw error;
    }
  },

  // Remove course from team member
  removeCourse: async (enrollmentId) => {
    try {
      const res = await fetch(`${API_BASE}/api/supervisor/remove-course`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          enrollment_id: enrollmentId,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to remove course");
      }
      return await res.json();
    } catch (error) {
      console.error("Error removing course:", error);
      throw error;
    }
  },

  // Get supervisor team statistics
  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/supervisor/stats`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    } catch (error) {
      console.error("Error fetching supervisor stats:", error);
      return { active_courses: 0, completion_rate: 0 };
    }
  },
};

// ====================================================
// 🔔 NOTIFICATION API
// ====================================================

export const notificationAPI = {
  // Get user notifications
  getMyNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return await res.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/${notificationId}/mark-read`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
      return await res.json();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return null;
    }
  },
};
