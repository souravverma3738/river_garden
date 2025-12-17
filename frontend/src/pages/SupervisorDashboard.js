import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Component/ui/card';
import { Button } from '../Component/ui/button';
import { Badge } from '../Component/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../Component/ui/avatar';
import { supervisorAPI } from '../services/api';
import { MemberDetailDialog } from '../Component/supervisor/MemberDetailDialog';
import { toast } from 'sonner';

export const SupervisorDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState({ active_courses: 0, completion_rate: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetail, setShowMemberDetail] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [members, statsData] = await Promise.all([
        supervisorAPI.getMyTeam(),
        supervisorAPI.getStats()
      ]);
      setTeamMembers(members);
      setStats(statsData || { active_courses: 0, completion_rate: 0 });
    } catch (error) {
      console.error('Error loading team data:', error);
      showToast('Failed to load team data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleCourseRemoved = (message) => {
    showToast(message, 'success');
    loadTeamData(); // Refresh team data
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="supervisor-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supervisor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and their training progress
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Members assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_courses || 0}</div>
            <p className="text-xs text-muted-foreground">Courses in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completion_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">Overall team progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Members List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Team Members</CardTitle>
                  <CardDescription>View and manage individual team members</CardDescription>
                </div>
                <Badge variant="outline" data-testid="team-size-badge">
                  {teamMembers.length} Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                      data-testid={`team-member-${member.id}`}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                      {member.branch && (
                        <Badge variant="secondary">{member.branch}</Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMember(member)}
                        data-testid={`view-member-${member.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No team members assigned to you yet</p>
                    <p className="text-sm mt-2">Contact your administrator to assign team members</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => loadTeamData()}
                data-testid="refresh-button"
              >
                Refresh Team Data
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Monitor team member progress</p>
              <p>✓ View course completion status</p>
              <p>✓ Track training compliance</p>
              <p>✓ Support team learning needs</p>
              <p className="text-xs mt-4 pt-4 border-t">
                ℹ️ Course assignments are now managed by administrators
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <MemberDetailDialog
        isOpen={showMemberDetail}
        onClose={() => setShowMemberDetail(false)}
        member={selectedMember}
        onCourseRemoved={handleCourseRemoved}
        isSupervisor={true}
      />
    </div>
  );
};
