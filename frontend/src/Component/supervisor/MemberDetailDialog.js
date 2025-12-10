import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { supervisorAPI } from '../../services/api';

export const MemberDetailDialog = ({ isOpen, onClose, member, onCourseRemoved }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (isOpen && member) {
      loadMemberEnrollments();
    }
  }, [isOpen, member]);

  const loadMemberEnrollments = async () => {
    setLoading(true);
    try {
      const data = await supervisorAPI.getMemberEnrollments(member.id);
      setEnrollments(data);
    } catch (error) {
      console.error('Error loading member enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async (enrollmentId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to remove "${courseTitle}" from ${member.name}?`)) {
      return;
    }

    setRemovingId(enrollmentId);
    try {
      await supervisorAPI.removeCourse(enrollmentId);
      onCourseRemoved(`Course removed successfully from ${member.name}`);
      // Reload enrollments
      await loadMemberEnrollments();
    } catch (error) {
      alert(`Failed to remove course: ${error.message}`);
    } finally {
      setRemovingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'completed': 'default',
      'in-progress': 'secondary',
      'overdue': 'destructive',
      'not-started': 'outline'
    };
    return variants[status] || 'outline';
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="member-detail-dialog">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {member.role} • {member.branch || 'No branch'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-testid="close-detail-dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="font-semibold mb-4">Assigned Courses ({enrollments.length})</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading courses...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No courses assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  data-testid={`enrollment-${enrollment.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(enrollment.status)}
                        <h4 className="font-medium">{enrollment.course_title}</h4>
                      </div>
                      <p className="text-sm text-gray-500">{enrollment.course_category}</p>
                    </div>
                    <Badge variant={getStatusBadge(enrollment.status)}>
                      {enrollment.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>

                  {/* Score if available */}
                  {enrollment.score && (
                    <p className="text-sm text-gray-600 mb-2">
                      Score: <span className="font-medium">{enrollment.score}%</span>
                    </p>
                  )}

                  {/* Dates */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {enrollment.started_date
                        ? `Started: ${new Date(enrollment.started_date).toLocaleDateString()}`
                        : 'Not started'}
                    </span>
                    {enrollment.due_date && (
                      <span>Due: {new Date(enrollment.due_date).toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <div className="mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCourse(enrollment.id, enrollment.course_title)}
                      disabled={removingId === enrollment.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      data-testid={`remove-course-${enrollment.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {removingId === enrollment.id ? 'Removing...' : 'Remove Course'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <Button onClick={onClose} className="w-full" data-testid="close-button">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
