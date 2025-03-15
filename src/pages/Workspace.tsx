import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertCircle, Loader2 } from 'lucide-react';
import WorkspaceHeader from '../components/workspace/WorkspaceHeader';
import WorkspaceArtifacts from '../components/workspace/WorkspaceArtifacts';
import WorkspaceApiLinks from '../components/workspace/WorkspaceApiLinks';
import WorkspaceSettings from '../components/workspace/WorkspaceSettings';
import WorkspaceMembers from '../components/WorkspaceMembers';
import { useAuth } from '../lib/auth';

interface Workspace {
  id: string;
  title: string;
  image_url: string | null;
  owner_id: string;
}

interface SapApiLink {
  id: string;
  name: string;
  url: string;
  description: string | null;
}

const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiLinks, setApiLinks] = useState<SapApiLink[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'artifacts' | 'apis' | 'members' | 'settings'>('artifacts');

  useEffect(() => {
    if (id) {
      checkAccess();
    }
  }, [id, user]);

  const checkAccess = async () => {
    try {
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', id)
        .single();

      if (workspaceError) throw workspaceError;

      if (workspace.owner_id === user?.id) {
        setHasAccess(true);
        setWorkspace(workspace);
        fetchApiLinks();
        return;
      }

      const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', id)
        .eq('user_id', user?.id)
        .single();

      if (memberError && memberError.code !== 'PGRST116') {
        throw memberError;
      }

      if (member) {
        setHasAccess(true);
        setWorkspace(workspace);
        fetchApiLinks();
      } else {
        navigate('/dashboard/profile');
      }
    } catch (error) {
      console.error('Error checking access:', error);
      navigate('/dashboard/profile');
    }
  };

  const fetchApiLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('sap_api_links')
        .select('*')
        .eq('workspace_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setApiLinks(data || []);
    } catch (error) {
      console.error('Error fetching API links:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workspace?')) return;

    try {
      if (workspace?.image_url) {
        const imagePath = workspace.image_url.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('workspace-images')
            .remove([`workspaces/${imagePath}`]);
        }
      }

      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);

      if (error) throw error;

      window.dispatchEvent(new CustomEvent('workspaceDeleted', { detail: { id } }));
      
      navigate('/dashboard/profile');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      setError('Failed to delete workspace');
    }
  };

  const handleUpdate = async (updatedWorkspace: { title: string; image_url: string | null }) => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase
        .from('workspaces')
        .update({
          title: updatedWorkspace.title,
          image_url: updatedWorkspace.image_url || null,
        })
        .eq('id', id);

      if (error) throw error;
      
      setWorkspace(prev => prev ? { ...prev, ...updatedWorkspace } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating workspace:', error);
      setError('Failed to update workspace');
    } finally {
      setLoading(false);
    }
  };

  if (!hasAccess) {
    return null;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkspaceHeader
        title={workspace.title}
        imageUrl={workspace.image_url}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="max-w-6xl mx-auto px-8 py-8">
        {activeTab === 'artifacts' && (
          <WorkspaceArtifacts workspaceId={workspace.id} />
        )}

        {activeTab === 'apis' && (
          <WorkspaceApiLinks
            workspaceId={workspace.id}
            apiLinks={apiLinks}
            setApiLinks={setApiLinks}
          />
        )}

        {activeTab === 'settings' && (
          <WorkspaceSettings
            workspace={workspace}
            userId={user?.id || ''}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}

        {activeTab === 'members' && workspace.owner_id === user?.id && (
          <WorkspaceMembers workspaceId={workspace.id} ownerId={workspace.owner_id} />
        )}
      </div>
    </div>
  );
};

export default Workspace;