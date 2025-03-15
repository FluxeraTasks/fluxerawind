import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, X, Shield } from 'lucide-react';

interface Member {
  user_id: string;
  role: 'viewer' | 'editor';
  name: string;
  email: string;
}

interface WorkspaceMembersProps {
  workspaceId: string;
  ownerId: string;
}

const WorkspaceMembers = ({ workspaceId, ownerId }: WorkspaceMembersProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('workspace_member_details')
        .select('*')
        .eq('workspace_id', workspaceId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // First get the user ID from the user_lookup view
      const { data: userData, error: userError } = await supabase
        .from('user_lookup')
        .select('user_id, email')
        .eq('email', email)
        .maybeSingle();

      if (userError) throw userError;

      if (!userData) {
        setError('User not found. Please check the email address.');
        return;
      }

      // Check if user is already a member
      const isMember = members.some(member => member.email === email);
      if (isMember) {
        setError('User is already a member of this workspace');
        return;
      }

      // Add member to workspace
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert([
          {
            workspace_id: workspaceId,
            user_id: userData.user_id,
            role
          }
        ]);

      if (memberError) throw memberError;

      setSuccess('Member added successfully');
      setIsAddingMember(false);
      setEmail('');
      setRole('viewer');
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member. Please try again.');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

      if (error) throw error;

      setMembers(members.filter(member => member.user_id !== userId));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'viewer' | 'editor') => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ role: newRole })
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

      if (error) throw error;

      setMembers(members.map(member =>
        member.user_id === userId ? { ...member, role: newRole } : member
      ));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Membros do Workspace</h2>
        <button
          onClick={() => setIsAddingMember(true)}
          className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
        >
          <UserPlus className="w-4 h-4" />
          Adicionar Membro
        </button>
      </div>

      {isAddingMember && (
        <form onSubmit={handleAddMember} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Adicionar Membro
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingMember(false);
                  setEmail('');
                  setRole('viewer');
                  setError('');
                  setSuccess('');
                }}
                className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {member.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {member.user_id !== ownerId && (
                  <>
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.user_id, e.target.value as 'viewer' | 'editor')}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.user_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                {member.user_id === ownerId && (
                  <div className="flex items-center gap-1 text-purple-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Owner</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {members.length === 0 && !isAddingMember && (
          <p className="text-center text-gray-500 py-4">
            No members yet. Add members to collaborate on this workspace.
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkspaceMembers;