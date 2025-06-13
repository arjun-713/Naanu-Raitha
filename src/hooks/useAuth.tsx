
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    // Check for dummy session first
    const dummySession = localStorage.getItem('dummy-auth-session');
    if (dummySession) {
      try {
        const session = JSON.parse(dummySession);
        setUser(session.user);
        // For dummy auth, assume profile is always complete
        setHasProfile(true);
        setLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('dummy-auth-session');
      }
    }

    // Fallback to real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkProfile(session.user.id);
        } else {
          setHasProfile(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('state, district, preferred_mandi')
        .eq('id', userId)
        .single();

      setHasProfile(!!(data?.state && data?.district && data?.preferred_mandi));
    } catch (error) {
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // Clear dummy session
    localStorage.removeItem('dummy-auth-session');
    // Also sign out from Supabase if there's a real session
    await supabase.auth.signOut();
    setUser(null);
    setHasProfile(false);
  };

  return {
    user,
    loading,
    hasProfile,
    signOut,
  };
};
