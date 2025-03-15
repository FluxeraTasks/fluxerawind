import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Plus, ChevronDown } from 'lucide-react';
import { signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface Workspace {
  id: string;
  title: string;
  image_url: string | null;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ title: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  
  useEffect(() => {
    fetchWorkspaces();

    // Listen for workspace deletion events
    const handleWorkspaceDeleted = (event: CustomEvent<{ id: string }>) => {
      setWorkspaces(prevWorkspaces => 
        prevWorkspaces.filter(workspace => workspace.id !== event.detail.id)
      );
      setSelectedWorkspace(null);
    };

    window.addEventListener('workspaceDeleted', handleWorkspaceDeleted as EventListener);

    return () => {
      window.removeEventListener('workspaceDeleted', handleWorkspaceDeleted as EventListener);
    };
  }, []);

  useEffect(() => {
    // Extract workspace ID from URL if present
    const match = location.pathname.match(/\/workspace\/([^/]+)/);
    if (match) {
      setSelectedWorkspace(match[1]);
    }
  }, [location.pathname]);

  const fetchWorkspaces = async () => {
    try {
      // Fetch workspaces where user is either owner or member
      const { data: ownedWorkspaces, error: ownedError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: true });

      if (ownedError) throw ownedError;

      const { data: memberWorkspaces, error: memberError } = await supabase
        .from('workspaces')
        .select('*, workspace_members!inner(*)')
        .eq('workspace_members.user_id', user?.id)
        .order('created_at', { ascending: true });

      if (memberError) throw memberError;

      // Combine and deduplicate workspaces
      const allWorkspaces = [...(ownedWorkspaces || []), ...(memberWorkspaces || [])];
      const uniqueWorkspaces = Array.from(
        new Map(allWorkspaces.map(item => [item.id, item])).values()
      );

      setWorkspaces(uniqueWorkspaces);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workspaces')
        .insert([{
          title: newWorkspace.title,
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setWorkspaces([...workspaces, data]);
      setIsCreatingWorkspace(false);
      setNewWorkspace({ title: '' });
      setSelectedWorkspace(data.id);
      navigate(`/dashboard/workspace/${data.id}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    navigate(`/dashboard/workspace/${workspaceId}`);
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white h-full shadow-lg flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="/FluxeraIcon.png"
            alt="Fluxera"
            className="w-8 h-8"
          />
          <span className="text-lg font-semibold text-gray-900">Fluxera</span>
        </div>

        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedWorkspace && workspaces.find(w => w.id === selectedWorkspace) ? (
                  <>
                    {workspaces.find(w => w.id === selectedWorkspace)?.image_url ? (
                      <img
                        src={workspaces.find(w => w.id === selectedWorkspace)?.image_url!}
                        alt="Workspace"
                        className="w-5 h-5 rounded"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          {workspaces.find(w => w.id === selectedWorkspace)?.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium truncate">
                      {workspaces.find(w => w.id === selectedWorkspace)?.title}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Select Workspace</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                <div className="p-1">
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => handleWorkspaceChange(workspace.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                        workspace.id === selectedWorkspace
                          ? 'bg-purple-100 text-purple-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {workspace.image_url ? (
                        <img
                          src={workspace.image_url}
                          alt={workspace.title}
                          className="w-4 h-4 rounded"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {workspace.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-sm truncate">{workspace.title}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsCreatingWorkspace(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md text-left mt-1 border-t"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">New Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isCreatingWorkspace && (
            <form onSubmit={handleCreateWorkspace} className="mt-4 p-3 bg-purple-50 rounded-lg">
              <input
                type="text"
                placeholder="Workspace name"
                value={newWorkspace.title}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, title: e.target.value })}
                className="w-full mb-2 px-2 py-1 text-sm border rounded"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-2 py-1 rounded text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingWorkspace(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <nav className="space-y-2">
          <Link
            to="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/profile')
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </Link>

          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/settings')
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-purple-50 hover:text-purple-600 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;