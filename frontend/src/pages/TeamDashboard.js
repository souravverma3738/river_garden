import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { StatsCard } from '../Component/dashboard/StatsCard';
import { ComplianceChart } from '../Component/dashboard/ComplianceChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Component/ui/card';
import { Button } from '../Component/ui/button';
import { Progress } from '../Component/ui/progress';
import { Badge } from '../Component/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../Component/ui/avatar';
import { statsAPI, teamAPI, enrollmentAPI } from '../services/api';

export const TeamDashboard = () => {
  const [teamStats, setTeamStats] = useState(null);
  const [complianceData, setComplianceData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [stats, compliance, members] = await Promise.all([
        statsAPI.getTeamStats(),
        statsAPI.getComplianceTrend(),
        teamAPI.getMembers(),
      ]);
      setTeamStats(stats);
      setComplianceData(compliance);
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your team's training compliance and progress
          </p>
        </div>
        <Button variant="premium">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      {teamStats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={Users}
            title="Team Size"
            value={teamStats.team_size}
            subtitle="active members"
          />
          <StatsCard
            icon={TrendingUp}
            title="Avg Compliance"
            value={`${teamStats.avg_compliance}%`}
            trend={{ value: '+5%', label: 'from last month', positive: true }}
          />
          <StatsCard
            icon={CheckCircle}
            title="Completed"
            value={teamStats.total_hours}
            subtitle="training hours"
          />
          <StatsCard
            icon={AlertCircle}
            title="Overdue"
            value={teamStats.overdue_count}
            subtitle="team members"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Compliance Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ComplianceChart data={complianceData} />

          {/* Team Members List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>View and manage individual team members</CardDescription>
                </div>
                <Badge variant="outline">{teamMembers.length} Members</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.length > 0 ? (
                  teamMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant="outline">{member.branch}</Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No team members assigned</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Send Reminders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Assign New Course
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Full Report
              </Button>
            </CardContent>
          </Card>

          {/* Training by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Training by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Mandatory</span>
                  <span className="font-semibold">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Specialist</span>
                  <span className="font-semibold">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Advanced</span>
                  <span className="font-semibold">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};