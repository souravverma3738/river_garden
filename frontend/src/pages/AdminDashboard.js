import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Award, AlertCircle, TrendingUp, 
  UserCheck, Clock, CheckCircle, XCircle, Activity,
  FileText, Shield, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Component/ui/card';
import { Button } from '../Component/ui/button';
import { Badge } from '../Component/ui/badge';
import { Progress } from '../Component/ui/progress';
import { Input } from '../Component/ui/input';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [usersTrainingStatus, setUsersTrainingStatus] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(usersTrainingStatus);
    } else {
      const filtered = usersTrainingStatus.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, usersTrainingStatus]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, trainingStatus] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getUsersTrainingStatus()
      ]);

      setStats(dashboardStats);
      setUsersTrainingStatus(trainingStatus);
      setFilteredUsers(trainingStatus);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (rate) => {
    if (rate >= 80) return 'text-green-600 bg-green-50';
    if (rate >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getComplianceBadgeVariant = (rate) => {
    if (rate >= 80) return 'default';
    if (rate >= 50) return 'secondary';
    return 'destructive';
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive auditing, compliance monitoring, and system oversight
          </p>
        </div>
        <Button onClick={() => navigate('/admin/bulk-assign')} data-testid="bulk-assign-button">
          <BookOpen className="h-4 w-4 mr-2" />
          Bulk Assign Courses
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.active_users_7_days || 0} active in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overall_compliance_rate || 0}%</div>
            <Progress value={stats?.overall_compliance_rate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Trainings</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.overdue_enrollments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_certificates || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Issued certificates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enrollment Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Enrollment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Completed</span>
              </div>
              <span className="font-bold">{stats?.completed_enrollments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm">In Progress</span>
              </div>
              <span className="font-bold">{stats?.in_progress_enrollments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Not Started</span>
              </div>
              <span className="font-bold">{stats?.not_started_enrollments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Overdue</span>
              </div>
              <span className="font-bold text-red-600">{stats?.overdue_enrollments || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats?.role_distribution && Object.entries(stats.role_distribution).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm">{role}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Courses</span>
              <span className="font-bold">{stats?.total_courses || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Enrollments</span>
              <span className="font-bold">{stats?.total_enrollments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Courses/User</span>
              <span className="font-bold">{stats?.avg_courses_per_user || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Never Logged In</span>
              <span className="font-bold text-amber-600">{stats?.never_logged_in || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Administrative tools and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/bulk-assign')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Bulk Assign Courses
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/assign')}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Supervisors
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => loadAdminData()}
            >
              <Activity className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Users Training Status Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                User Training Status & Auditing
              </CardTitle>
              <CardDescription>Complete overview of all users with login tracking and compliance</CardDescription>
            </div>
            <Badge variant="outline">{filteredUsers.length} Users</Badge>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Last Login</th>
                  <th className="text-left p-3 font-medium">Total Courses</th>
                  <th className="text-left p-3 font-medium">Completed</th>
                  <th className="text-left p-3 font-medium">In Progress</th>
                  <th className="text-left p-3 font-medium">Overdue</th>
                  <th className="text-left p-3 font-medium">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatLastLogin(user.last_login)}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-medium">{user.total_courses}</span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {user.completed_courses}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {user.in_progress_courses}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {user.overdue_courses > 0 ? (
                        <Badge variant="destructive">{user.overdue_courses}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getComplianceBadgeVariant(user.compliance_rate)}>
                          {user.compliance_rate}%
                        </Badge>
                        <Progress value={user.compliance_rate} className="w-20" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
