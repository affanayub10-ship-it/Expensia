import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { loginWithStoredCredentials, registerWithStoredCredentials, changePassword as changePasswordHybrid } from "@/lib/auth-hybrid";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

/* ─────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check active session and listen for auth changes
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserProfile(userId: string) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        setUser({
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar || undefined,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Try hybrid authentication (checks stored credentials and creates auth user if needed)
      const result = await loginWithStoredCredentials(email, password);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  }

  async function signup(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Register with hybrid system (stores in both places)
      const result = await registerWithStoredCredentials(name, email, password);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || "Signup failed" };
    }
  }

  async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Password reset failed" };
    }
  }

  async function updateUser(
    name: string,
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return { success: false, error: "Not authenticated" };

      const { error } = await supabase
        .from("profiles")
        .update({ name, email: email.toLowerCase().trim() })
        .eq("id", authUser.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setUser({ email: email.toLowerCase().trim(), name, avatar: user?.avatar });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Update failed" };
    }
  }

  async function changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await changePasswordHybrid(currentPassword, newPassword);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || "Password change failed" };
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        resetPassword,
        updateUser,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
