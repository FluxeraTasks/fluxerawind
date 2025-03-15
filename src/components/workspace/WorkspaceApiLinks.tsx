import React from 'react';
import { Plus, Link as LinkIcon, PlayCircle, Loader2, Trash2, Save, X } from 'lucide-react';
import SapArtifact from '../SapArtifact';
import { supabase } from '../../lib/supabase';
import axios from 'axios';

interface SapApiLink {
  id: string;
  name: string;
  url: string;
  description: string | null;
}

interface ApiTestStatus {
  [key: string]: {
    loading: boolean;
    success: boolean | null;
    error: string | null;
  };
}

interface WorkspaceApiLinksProps {
  workspaceId: string;
  apiLinks: SapApiLink[];
  setApiLinks: React.Dispatch<React.SetStateAction<SapApiLink[]>>;
}

const WorkspaceApiLinks: React.FC<WorkspaceApiLinksProps> = ({
  workspaceId,
  apiLinks,
  setApiLinks,
}) => {
  const [isAddingApi, setIsAddingApi] = React.useState(false);
  const [newApiForm, setNewApiForm] = React.useState({
    name: '',
    url: '',
    description: ''
  });
  const [apiTestStatus, setApiTestStatus] = React.useState<ApiTestStatus>({});
  const [artifactData, setArtifactData] = React.useState<{ [key: string]: any }>({});
  const [loadingArtifacts, setLoadingArtifacts] = React.useState<{ [key: string]: boolean }>({});
  const [error, setError] = React.useState('');

  const handleAddApiLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('sap_api_links')
        .insert([{
          workspace_id: workspaceId,
          name: newApiForm.name,
          url: newApiForm.url,
          description: newApiForm.description || null
        }])
        .select()
        .single();

      if (error) throw error;

      setApiLinks([...apiLinks, data]);
      setIsAddingApi(false);
      setNewApiForm({ name: '', url: '', description: '' });
    } catch (error) {
      console.error('Error adding API link:', error);
      setError('Failed to add API link');
    }
  };

  const handleDeleteApiLink = async (apiId: string) => {
    if (!window.confirm('Are you sure you want to delete this API link?')) return;

    try {
      const { error } = await supabase
        .from('sap_api_links')
        .delete()
        .eq('id', apiId);

      if (error) throw error;

      setApiLinks(apiLinks.filter(api => api.id !== apiId));
      setApiTestStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[apiId];
        return newStatus;
      });
    } catch (error) {
      console.error('Error deleting API link:', error);
      setError('Failed to delete API link');
    }
  };

  const fetchArtifactData = async (api: SapApiLink) => {
    setLoadingArtifacts(prev => ({ ...prev, [api.id]: true }));
    try {
      const response = await axios.get(api.url);
      setArtifactData(prev => ({
        ...prev,
        [api.id]: response.data
      }));
    } catch (error) {
      console.error('Error fetching artifact data:', error);
      setArtifactData(prev => ({
        ...prev,
        [api.id]: { error: 'Failed to fetch artifact data' }
      }));
    } finally {
      setLoadingArtifacts(prev => ({ ...prev, [api.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">SAP API Links</h2>
        <button
          onClick={() => setIsAddingApi(true)}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Criar API Link
        </button>
      </div>

      {isAddingApi && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleAddApiLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome API
              </label>
              <input
                type="text"
                value={newApiForm.name}
                onChange={(e) => setNewApiForm({ ...newApiForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="e.g., Products API"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL API
              </label>
              <input
                type="url"
                value={newApiForm.url}
                onChange={(e) => setNewApiForm({ ...newApiForm, url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="https://api.example.com/v1/products"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descriçao
              </label>
              <textarea
                value={newApiForm.description}
                onChange={(e) => setNewApiForm({ ...newApiForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Describe what this API is used for..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingApi(false);
                  setNewApiForm({ name: '', url: '', description: '' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {apiLinks.map((api) => (
          <div
            key={api.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="p-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{api.name}</h3>
                <a
                  href={api.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <LinkIcon className="w-4 h-4" />
                  {api.url}
                </a>
                {api.description && (
                  <p className="mt-2 text-sm text-gray-600">{api.description}</p>
                )}
                {apiTestStatus[api.id] && (
                  <div className="mt-2">
                    {apiTestStatus[api.id].loading ? (
                      <span className="text-sm text-gray-500">Testando conexao...</span>
                    ) : apiTestStatus[api.id].success ? (
                      <span className="text-sm text-green-600">Sucesso na conexao</span>
                    ) : (
                      <span className="text-sm text-red-600">
                        {apiTestStatus[api.id].error || 'Connection failed'}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchArtifactData(api)}
                  disabled={loadingArtifacts[api.id]}
                  className="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-50 transition-colors"
                  title="Fetch Artifact Data"
                >
                  {loadingArtifacts[api.id] ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <PlayCircle className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteApiLink(api.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete API Link"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {artifactData[api.id] && (
              <div className="border-t bg-gray-50 p-4">
                <SapArtifact
                  name={api.name}
                  url={api.url}
                  data={artifactData[api.id]}
                />
              </div>
            )}
          </div>
        ))}
        {apiLinks.length === 0 && !isAddingApi && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <LinkIcon className="w-8 h-8 text-gray-400" />
              <p className="text-gray-600">
                No API links added yet. Click "Add API Link" to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceApiLinks;