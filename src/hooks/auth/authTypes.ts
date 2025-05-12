
import { Member, User } from '@/types';
import { Session } from '@supabase/supabase-js';

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (emailOrPsn: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser?: (updatedUser: User) => void;
  session: Session | null;
}
