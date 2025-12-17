import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Search, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Component/ui/card';
import { Button } from '../Component/ui/button';
import { Input } from '../Component/ui/input';
import { Label } from '../Component/ui/label';
import { Badge } from '../Component/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../Component/ui/avatar';
import { adminAPI, courseAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const BulkCourseAssignment = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [excludedUserIds, setExcludedUserIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setDataLoading(true);
      const [coursesData, usersData] = await Promise.all([
        courseAPI.getAll(),
        adminAPI.getUsersTrainingStatus()
      ]);

      setCourses(coursesData);
      setAllUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setDataLoading(false);
    }
  };

  const toggleUserExclusion = (userId) => {
    const newExcluded = new Set(excludedUserIds);
    if (newExcluded.has(userId)) {
      newExcluded.delete(userId);
    } else {
      newExcluded.add(userId);
    }
    setExcludedUserIds(newExcluded);
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUsers = filteredUsers.filter(user => !excludedUserIds.has(user.id));
  const excludedUsers = filteredUsers.filter(user => excludedUserIds.has(user.id));

  const handleBulkAssign = async () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    const userIdsToAssign = allUsers
      .filter(user => !excludedUserIds.has(user.id))
      .map(user => user.id);

    if (userIdsToAssign.length === 0) {
      toast.error('No users selected for assignment');
      return;
    }

    setLoading(true);
    try {
      const result = await adminAPI.bulkAssignCourse(
        parseInt(selectedCourse),
        userIdsToAssign.join(',')
      );

      toast.success(
        `✅ Course assigned to ${result.enrolled_count} users! (${result.skipped_count} already enrolled)`
      );
      
      // Reset form
      setSelectedCourse('');
      setExcludedUserIds(new Set());
      setSearchTerm('');
      
      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      toast.error('Failed to assign course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto" data-testid="bulk-course-assignment">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Bulk Course Assignment
          </h1>
          <p className="text-muted-foreground mt-2">
            Assign courses to all employees at once with the ability to exclude specific users
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select Course</CardTitle>
          <CardDescription>Choose the course you want to assign to employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              data-testid="course-select"
            >
              <option value="">-- Select a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.category}) - {course.duration}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Step 2: Select Employees</CardTitle>
              <CardDescription>
                All employees are selected by default. Click on users to exclude them from assignment.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                {selectedUsers.length} Selected
              </Badge>
              <Badge variant="outline" className="bg-red-50">
                <X className="h-3 w-3 mr-1" />
                {excludedUsers.length} Excluded
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-users"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Users to be assigned ({selectedUsers.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => toggleUserExclusion(user.id)}
                      data-testid={`user-${user.id}`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Excluded Users */}
            {excludedUsers.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Excluded users ({excludedUsers.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {excludedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 rounded-lg border border-red-200 bg-red-50 p-3 hover:bg-red-100 transition-colors cursor-pointer"
                      onClick={() => toggleUserExclusion(user.id)}
                      data-testid={`excluded-user-${user.id}`}
                    >
                      <Avatar className="h-10 w-10 opacity-50">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary & Action */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Review & Assign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Selected Course:</span>
                <span className="text-muted-foreground">
                  {selectedCourse ? courses.find(c => c.id === parseInt(selectedCourse))?.title : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Employees:</span>
                <span className="text-muted-foreground">{allUsers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">To be assigned:</span>
                <span className="text-green-600 font-bold">{allUsers.length - excludedUserIds.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Excluded:</span>
                <span className="text-red-600 font-bold">{excludedUserIds.size}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCourse('');
                  setExcludedUserIds(new Set());
                  setSearchTerm('');
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                onClick={handleBulkAssign}
                disabled={loading || !selectedCourse || (allUsers.length - excludedUserIds.size === 0)}
                data-testid="assign-button"
              >
                {loading ? 'Assigning...' : `Assign Course to ${allUsers.length - excludedUserIds.size} Users`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
