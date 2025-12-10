import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../Component/ui/card';
import { Button } from '../Component/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../Component/ui/select';
import { adminAPI, teamAPI } from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const UnassignSupervisor = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allMembers = await adminAPI.getAllUsers();
      const sups = allMembers.filter(m => ['Supervisor', 'supervisor'].includes(m.role));
      const team = allMembers.filter(m => !['Supervisor', 'supervisor', 'Admin'].includes(m.role));
      setSupervisors(sups);
      setMembers(team);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleUnassign = async () => {
    if (!selectedSupervisor || !selectedMember) {
      toast.error('Please select both supervisor and member');
      return;
    }
    setLoading(true);
    try {
      await adminAPI.unassignSupervisor(selectedSupervisor, selectedMember);
      toast.success('✅ Unassigned successfully!');
      setSelectedSupervisor('');
      setSelectedMember('');
    } catch (err) {
      toast.error('❌ Failed to unassign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Unassign Supervisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Supervisor</label>
            <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisors.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name} ({s.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Team Member</label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a team member" />
              </SelectTrigger>
              <SelectContent>
                {members.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.name} ({m.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back
            </Button>
            <Button onClick={handleUnassign} disabled={loading}>
              {loading ? 'Removing...' : 'Unassign'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
