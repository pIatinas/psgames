// Cache management for authentication
import { supabase } from '@/integrations/supabase/client';

export const clearAuthCache = async () => {
  try {
    // Clear all storage related to Supabase auth
    const storage = window.localStorage;
    const sessionStorage = window.sessionStorage;
    
    // Get all keys and remove Supabase related ones
    const localStorageKeys = Object.keys(storage);
    const sessionStorageKeys = Object.keys(sessionStorage);
    
    localStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth-token')) {
        storage.removeItem(key);
        console.log('Removed localStorage key:', key);
      }
    });
    
    sessionStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth-token')) {
        sessionStorage.removeItem(key);
        console.log('Removed sessionStorage key:', key);
      }
    });
    
    // Force sign out to clear any lingering auth state
    await supabase.auth.signOut();
    
    console.log('Auth cache cleared successfully');
  } catch (error) {
    console.error('Error clearing auth cache:', error);
  }
};

export const isTokenExpired = (session: any): boolean => {
  if (!session || !session.expires_at) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expiresAt = session.expires_at;
  
  // Consider token expired if it expires within the next 5 minutes
  return expiresAt - currentTime < 300;
};

export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      await clearAuthCache();
      return false;
    }
    
    if (!session) {
      return false;
    }
    
    if (isTokenExpired(session)) {
      console.log('Token is expired, clearing cache');
      await clearAuthCache();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    await clearAuthCache();
    return false;
  }
};