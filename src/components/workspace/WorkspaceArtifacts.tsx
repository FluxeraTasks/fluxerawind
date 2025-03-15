import React, { useState, useEffect } from 'react';
import { Plus, FileJson, Save, X, Trash2, PlayCircle, Loader2, Eye, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import axios from 'axios';
import ArtifactDocumentation from '../ArtifactDocumentation';

interface Artifact {
  id: string;
  name: string;
  technical_name: string;
  data: any;
  api_url: string | null;
  documentation: string | null;
  created_at: string;
}

interface SapApiLink {
  id: string;
  name: string;
  url: string;
  description: string | null;
}

interface WorkspaceArtifactsProps {
  workspaceId: string;
}

const WorkspaceArtifacts: React.FC<WorkspaceArtifactsProps> = ({ workspaceId }) => {
  const [isAddingArtifact, setIsAddingArtifact] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [apiLinks, setApiLinks] = useState<SapApiLink[]>([]);
  const [selectedApiId, setSelectedApiId] = useState<string>('');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [newArtifact, setNewArtifact] = useState({
    name: '',
    technical_name: '',
    data: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<{ [key: string]: boolean }>({});
  const [showDocumentation, setShowDocumentation] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchArtifacts();
      fetchApiLinks();
    }
  }, [workspaceId]);

  const fetchArtifacts = async () => {
    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setArtifacts(data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching artifacts:', error);
      setError('Failed to fetch artifacts. Please try refreshing the page.');
    }
  };

  const fetchApiLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('sap_api_links')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setApiLinks(data || []);
    } catch (error) {
      console.error('Error fetching API links:', error);
    }
  };

  const fetchApiData = async () => {
    setError('');
    setLoading(true);

    try {
      const selectedApi = apiLinks.find(api => api.id === selectedApiId);
      if (!selectedApi) {
        setError('Please select an API');
        return;
      }

      const url = newArtifact.technical_name
        ? `${selectedApi.url}${selectedApi.url.includes('?') ? '&' : '?'}artifact=${newArtifact.technical_name}`
        : selectedApi.url;

      const response = await axios.get(url);
      setNewArtifact(prev => ({
        ...prev,
        data: JSON.stringify(response.data, null, 2)
      }));
    } catch (error) {
      console.error('Error fetching API data:', error);
      setError('Failed to fetch API data. Please check the API URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(newArtifact.data);
      } catch (e) {
        setError('Invalid JSON data');
        return;
      }

      const selectedApi = apiLinks.find(api => api.id === selectedApiId);
      if (!selectedApi) {
        setError('Please select an API');
        return;
      }

      const { data, error } = await supabase
        .from('artifacts')
        .insert([{
          workspace_id: workspaceId,
          name: newArtifact.name,
          technical_name: newArtifact.technical_name,
          data: parsedData,
          api_url: selectedApi.url
        }])
        .select()
        .single();

      if (error) throw error;

      setArtifacts([data, ...artifacts]);
      setIsAddingArtifact(false);
      setNewArtifact({ name: '', technical_name: '', data: '' });
      setSelectedApiId('');
    } catch (error) {
      console.error('Error adding artifact:', error);
      setError('Failed to add artifact');
    }
  };

  const handleDeleteArtifact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this artifact?')) return;

    try {
      const { error } = await supabase
        .from('artifacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setArtifacts(artifacts.filter(artifact => artifact.id !== id));
      if (selectedArtifact?.id === id) {
        setSelectedArtifact(null);
      }
    } catch (error) {
      console.error('Error deleting artifact:', error);
      setError('Failed to delete artifact');
    }
  };

  const handleRefreshArtifact = async (artifact: Artifact) => {
    if (!artifact.api_url) {
      setError('No API URL found for this artifact');
      return;
    }

    setRefreshing(prev => ({ ...prev, [artifact.id]: true }));
    try {
      const url = `${artifact.api_url}${artifact.api_url.includes('?') ? '&' : '?'}artifact=${artifact.technical_name}`;
      
      const response = await axios.get(url);
      
      const { error } = await supabase
        .from('artifacts')
        .update({ data: response.data })
        .eq('id', artifact.id);

      if (error) throw error;

      setArtifacts(artifacts.map(a => 
        a.id === artifact.id ? { ...a, data: response.data } : a
      ));
      if (selectedArtifact?.id === artifact.id) {
        setSelectedArtifact({ ...artifact, data: response.data });
      }
    } catch (error) {
      console.error('Error refreshing artifact:', error);
      setError('Failed to refresh artifact data');
    } finally {
      setRefreshing(prev => ({ ...prev, [artifact.id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDataSize = (data: any) => {
    const size = new Blob([JSON.stringify(data)]).size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleViewDocumentation = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setShowDocumentation(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Artefatos do Workspace</h2>
        <button
          onClick={() => setIsAddingArtifact(true)}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Artefato
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isAddingArtifact && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleAddArtifact} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={newArtifact.name}
                onChange={(e) => setNewArtifact({ ...newArtifact, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="e.g., User Schema"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Técnico
              </label>
              <input
                type="text"
                value={newArtifact.technical_name}
                onChange={(e) => setNewArtifact({ ...newArtifact, technical_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono"
                placeholder="e.g., USER_SCHEMA"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Este nome é o que vai ser utilizado na API
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedApiId}
                  onChange={(e) => setSelectedApiId(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Selecione a API</option>
                  {apiLinks.map(api => (
                    <option key={api.id} value={api.id}>
                      {api.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={fetchApiData}
                  disabled={!selectedApiId || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                  Buscar Dados
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estrutura Técnica
              </label>
              <textarea
                value={newArtifact.data}
                onChange={(e) => setNewArtifact({ ...newArtifact, data: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm"
                placeholder="JSON data will appear here after fetching from the API..."
                rows={10}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar Artefato
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingArtifact(false);
                  setNewArtifact({ name: '', technical_name: '', data: '' });
                  setSelectedApiId('');
                  setError('');
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
        {selectedArtifact ? (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedArtifact.name}</h3>
                  <p className="text-sm font-mono text-gray-500">
                    {selectedArtifact.technical_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Criado em {formatDate(selectedArtifact.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDocumentation(true)}
                    className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    {selectedArtifact.documentation ? 'Vier Documentação' : 'Gerar Documentação'}
                  </button>
                  <button
                    onClick={() => handleRefreshArtifact(selectedArtifact)}
                    disabled={refreshing[selectedArtifact.id]}
                    className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {refreshing[selectedArtifact.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Atualizar
                  </button>
                  <button
                    onClick={() => setSelectedArtifact(null)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => handleDeleteArtifact(selectedArtifact.id)}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(selectedArtifact.data, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nome Técnico</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Creado em</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tamanho</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 w-48">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {artifacts.map((artifact) => (
                    <tr key={artifact.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{artifact.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {artifact.documentation ? (
                            <button
                              onClick={() => handleViewDocumentation(artifact)}
                              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                            >
                              <FileText className="w-3 h-3" />
                              Ver Documentação
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewDocumentation(artifact)}
                              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600"
                            >
                              <FileText className="w-3 h-3" />
                              Gerar Documentação
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm text-gray-600">{artifact.technical_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(artifact.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500">
                          {getDataSize(artifact.data)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRefreshArtifact(artifact)}
                            disabled={refreshing[artifact.id]}
                            className="p-1 text-gray-400 hover:text-purple-600 transition-colors disabled:opacity-50"
                            title="Refresh Data"
                          >
                            {refreshing[artifact.id] ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <RefreshCw className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedArtifact(artifact)}
                            className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArtifact(artifact.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Artifact"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {artifacts.length === 0 && !isAddingArtifact && (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <FileJson className="w-8 h-8 text-gray-400" />
                  <p className="text-gray-600">
                    No artifacts added yet. Click "Add Artifact" to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showDocumentation && selectedArtifact && (
        <ArtifactDocumentation
          artifactId={selectedArtifact.id}
          artifactName={selectedArtifact.name}
          artifactData={selectedArtifact.data}
          documentation={selectedArtifact.documentation}
          onClose={() => {
            setShowDocumentation(false);
            // Refresh the artifacts list to get the updated documentation
            fetchArtifacts();
          }}
        />
      )}
    </div>
  );
};

export default WorkspaceArtifacts;