import React, { useRef } from 'react';
import { Pencil, Trash2, Save, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface WorkspaceSettingsProps {
  workspace: {
    id: string;
    title: string;
    image_url: string | null;
    owner_id: string;
  };
  userId: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onDelete: () => void;
  onUpdate: (workspace: { title: string; image_url: string | null }) => void;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({
  workspace,
  userId,
  isEditing,
  setIsEditing,
  onDelete,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = React.useState({
    title: workspace.title,
    image_url: workspace.image_url || ''
  });
  const [loading, setLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `workspaces/${fileName}`;

      setUploadProgress(0);

      const { error: uploadError } = await supabase.storage
        .from('workspace-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      const { data } = await supabase.storage
        .from('workspace-images')
        .getPublicUrl(filePath);

      if (!data.publicUrl) throw new Error('Failed to get public URL');

      setEditForm(prev => ({ ...prev, image_url: data.publicUrl }));
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadProgress(0);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (workspace.image_url && workspace.image_url !== editForm.image_url) {
        const oldImagePath = workspace.image_url.split('/').pop();
        if (oldImagePath) {
          await supabase.storage
            .from('workspace-images')
            .remove([`workspaces/${oldImagePath}`]);
        }
      }

      onUpdate(editForm);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Workspace</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Detalhes do Workspace</h3>
              <div className="mt-4 space-y-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors w-full"
                >
                  <Pencil className="w-4 h-4" />
                  Editar Workspace
                </button>
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Workspace ID:</span> {workspace.id}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Criado Por:</span>{' '}
                      {workspace.owner_id === userId ? 'You' : workspace.owner_id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {workspace.owner_id === userId && (
              <div className="pt-6 border-t">
                <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Uma vez que delete um workspace, não há como voltar atrás. Por favor tenha certeza.
                </p>
                <button
                  onClick={onDelete}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar Workspace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem Workspace
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {editForm.image_url ? (
                  <img
                    src={editForm.image_url}
                    alt={editForm.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-2xl font-medium text-purple-600">
                      {editForm.title.charAt(0)}
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {uploadProgress > 0 && (
                <div className="flex-1 max-w-xs">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Workspace
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter workspace name"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Modificações
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditForm({
                  title: workspace.title,
                  image_url: workspace.image_url || ''
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceSettings;