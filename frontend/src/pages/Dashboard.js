import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { StatsCard } from '../Component/dashboard/StatsCard';
import { ComplianceChart } from '../Component/dashboard/ComplianceChart';
import { CourseCard } from '../Component/courses/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Component/ui/card';
import { Button } from '../Component/ui/button';
import { Badge } from '../Component/ui/badge';
import { Progress } from '../Component/ui/progress';
import { courseAPI, enrollmentAPI, statsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const Dashboard = ({ userRole }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [complianceData, setComplianceData] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, complianceData, courses, enrollments] = await Promise.all([
        statsAPI.getUserStats(),
        statsAPI.getComplianceTrend(),
        courseAPI.getAll(),
        enrollmentAPI.getUserEnrollments(),
      ]);

      setStats(statsData);
      setComplianceData(complianceData);

      // Combine courses with enrollments
      const activeCoursesList = enrollments
        .filter(e => e.status === 'in-progress' || (e.progress > 0 && e.status !== 'completed'))
        .slice(0, 3)
        .map(enrollment => {
          const course = courses.find(c => c.id === enrollment.course_id);
          return { ...course, enrollment };
        });

      setActiveCourses(activeCoursesList);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = (course) => {
  // Go directly to course player for this course
  navigate(`/courses/${course.id}`);
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back, {currentUser?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-2">
            Here's your training progress overview
          </p>
        </div>
        <Button variant="premium" onClick={() => navigate('/courses')}>
          <BookOpen className="mr-2 h-4 w-4" />
          Browse Courses
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={BookOpen}
            title="Total Courses"
            value={stats.completed_courses}
            subtitle={stats.total_courses}
            trend={{ value: '+2', label: 'this month', positive: true }}
          />
          <StatsCard
            icon={Clock}
            title="In Progress"
            value={stats.in_progress}
            subtitle="courses"
          />
          <StatsCard
            icon={AlertCircle}
            title="Overdue"
            value={stats.overdue}
            subtitle="courses"
          />
          <StatsCard
            icon={TrendingUp}
            title="Compliance"
            value={`${stats.compliance_rate}%`}
            trend={{ value: '+5%', label: 'from last month', positive: true }}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <ComplianceChart data={complianceData} />

          {/* Current Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCourses.length > 0 ? (
                <div className="space-y-4">
                  {activeCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => handleStartCourse(course)}
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{course.title}</h4>
                          <Badge
                            variant={
                              course.enrollment.status === 'completed'
                                ? 'success'
                                : course.enrollment.status === 'in-progress'
                                ? 'warning'
                                : 'outline'
                            }
                          >
                            {course.enrollment.status === 'completed'
                              ? 'Completed'
                              : course.enrollment.status === 'in-progress'
                              ? 'In Progress'
                              : 'Not Started'}
                          </Badge>
                        </div>
                        {course.enrollment.progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span className="font-medium">{course.enrollment.progress}%</span>
                            </div>
                            <Progress value={course.enrollment.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No courses in progress</p>
                  <Button variant="link" onClick={() => navigate('/courses')}>Browse Courses</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/certificates')}
              >
                <Award className="mr-2 h-4 w-4" />
                View Certificates
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/courses')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse All Courses
              </Button>

              {/* ✅ Admin Only Options */}
              {currentUser?.role === 'Admin' && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/assign')}
                  >
                    Assign Supervisor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/unassign')}
                  >
                    Unassign Supervisor
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/certificates')}
              >
                <Award className="mr-2 h-4 w-4" />
                View Certificates
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/courses')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Score</span>
                  <span className="text-2xl font-bold text-success">{stats.avg_score}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Training Hours</span>
                  <span className="text-2xl font-bold">{stats.total_hours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Compliance Rate</span>
                  <span className="text-2xl font-bold text-primary">{stats.compliance_rate}%</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};