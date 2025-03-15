import { createContext, useContext } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return session;
};

export const signIn = async (email: string, password: string) => {
  // Primeiro, verifica se o usuário existe
  const { data: users, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (userError && userError.code === 'PGRST116') {
    throw new AuthError('Email não cadastrado. Por favor, registre-se primeiro.');
  }

  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return session;
};

export const signUp = async (email: string, password: string) => {
  // Primeiro, verifica se o usuário já existe
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new AuthError('Este email já está cadastrado. Por favor, faça login.');
  }

  const { data: { session }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    throw error;
  }

  // Create profile for new user
  if (session?.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: session.user.id,
          email: email,
          name: email.split('@')[0], // Use part of email as initial name
        }
      ]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw new Error('Erro ao criar perfil do usuário');
    }
  }
  
  return session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};