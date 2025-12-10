import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { courseAPI, supervisorAPI } from '../../services/api';

export const AssignCourseDialog = ({ isOpen, onClose, teamMembers, onSuccess }) => {
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  const loadCourses = async () => {
    try {
      const allCourses = await courseAPI.getAll();
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Failed to load courses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMember || !selectedCourse) {
      setError('Please select both member and course');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await supervisorAPI.assignCourse(parseInt(selectedMember), parseInt(selectedCourse));
      onSuccess('Course assigned successfully!');
      onClose();
      setSelectedMember('');
      setSelectedCourse('');
    } catch (err) {
      setError(err.message || 'Failed to assign course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="assign-course-dialog">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Assign Course to Team Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-testid="close-dialog-button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="member">Select Team Member</Label>
            <select
              id="member"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              data-testid="member-select"
            >
              <option value="">-- Choose a member --</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Select Course</Label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              data-testid="course-select"
            >
              <option value="">-- Choose a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.category})
                </option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              data-testid="assign-button"
            >
              {loading ? 'Assigning...' : 'Assign Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
