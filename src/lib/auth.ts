import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
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
  const { data: { session }, error } = await supabase.auth.signUp({
    email,
    password,
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
          name: email.split('@')[0], // Use part of email as initial name
        }
      ]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
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