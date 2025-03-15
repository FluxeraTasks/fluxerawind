import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!user?.id) return;

        // Debug: Verificar se conseguimos fazer uma consulta simples
        const { data: tables, error: tablesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        console.log('Debug - Tables:', tables);
        console.log('Debug - Tables Error:', tablesError);

        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Debug - Profile Error:', error);
          throw error;
        }

        if (data) {
          setName(data.name || '');
        } else {
          // Only create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                name: user.email?.split('@')[0] || '',
              }
            ])
            .select('name')
            .single();

          if (insertError) {
            console.error('Debug - Insert Error:', insertError);
            // If insert fails due to duplicate, try fetching again
            if (insertError.code === '23505') {
              const { data: retryData, error: retryError } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', user.id)
                .single();

              if (retryError) {
                console.error('Debug - Retry Error:', retryError);
                throw retryError;
              }
              if (retryData) setName(retryData.name || '');
            } else {
              throw insertError;
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setMessage('Erro ao carregar perfil. Por favor, recarregue a página.');
      }
    };

    if (user) getProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .match({ id: user.id });

      if (error) {
        console.error('Detailed error:', error);
        throw error;
      }
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Erro ao atualizar perfil. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('erro') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : (
              <>
                <Save className="w-4 h-4" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;