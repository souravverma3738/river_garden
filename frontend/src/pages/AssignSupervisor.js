import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../Component/ui/card';
import { Button } from '../Component/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../Component/ui/select';
import { adminAPI, teamAPI } from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const AssignSupervisor = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
       const allUsers = await adminAPI.getAllUsers();
       console.log('👥 All users from backend:', allUsers);

      // Normalize role names (ignore case)
      const normalized = allUsers.map(u => ({
        ...u,
        role: u.role?.trim().toLowerCase()
      }));

      const supervisors = normalized.filter(u =>
        ['team leader', 'care manager'].includes(u.role)
      );

      const members = normalized.filter(
        u => !['team leader', 'care manager', 'admin'].includes(u.role)
      );

      console.log('🧑‍💼 Supervisors:', supervisors);
      console.log('👷 Team members:', members);

      setSupervisors(supervisors);
      setTeamMembers(members);
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('❌ Failed to load users.');
    }
  };

  const handleAssign = async () => {
    if (!selectedSupervisor || !selectedMember) {
      toast.error('Please select both supervisor and team member.');
      return;
    }

    setLoading(true);
    try {
      await adminAPI.assignSupervisor(selectedSupervisor, selectedMember);
      toast.success('✅ Supervisor assigned successfully!');
      setSelectedSupervisor('');
      setSelectedMember('');
    } catch (err) {
      console.error('Error assigning supervisor:', err);
      toast.error('❌ Failed to assign supervisor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Assign Supervisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Supervisor</label>
            <Select
              value={selectedSupervisor}
              onValueChange={setSelectedSupervisor}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisors.length > 0 ? (
                  supervisors.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} ({s.role.charAt(0).toUpperCase() + s.role.slice(1)})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="">No supervisors found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Team Member</label>
            <Select
              value={selectedMember}
              onValueChange={setSelectedMember}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.length > 0 ? (
                  teamMembers.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.name} ({m.role.charAt(0).toUpperCase() + m.role.slice(1)})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="">No team members found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back
            </Button>
            <Button onClick={handleAssign} disabled={loading}>
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
