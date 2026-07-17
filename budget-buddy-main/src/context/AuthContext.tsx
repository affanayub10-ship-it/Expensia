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
  onboardingComplete?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  onboardingComplete: boolean;
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>;
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
  const [isNewUser, setIsNewUser] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

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
      // Retry up to 3 times with 500ms delay — handles the race where signup
      // trigger hasn't created the profile row yet
      let profile = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (data) { profile = data; break; }
        if (attempt < 2) await new Promise((r) => setTimeout(r, 600));
      }

      if (!profile) {
        // Try to self-heal: Create profile from Auth user details
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const email = authUser.email || "";
          const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || "User";
          
          // Try to insert the missing profile
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              name,
              email,
              onboarding_complete: false
            })
            .select()
            .single();
            
          if (newProfile) {
            profile = newProfile;
          } else {
            // If insert failed (maybe RLS/constraint), construct a local profile object
            profile = {
              id: userId,
              name,
              email,
              onboarding_complete: false,
              avatar: null
            };
          }
        }
      }

      if (profile) {
        setUser({
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar || undefined,
          onboardingComplete: profile.onboarding_complete || false,
        });
        setOnboardingComplete(profile.onboarding_complete || false);
      } else {
        // Profile doesn't exist yet — treat as new user needing onboarding
        setOnboardingComplete(false);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setOnboardingComplete(false);
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
      if (result.success) {
        // Mark as new user and clear onboarding flag
        setIsNewUser(true);
        localStorage.removeItem("onboarding_complete");
      }
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

  async function completeOnboarding(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return { success: false, error: "Not authenticated" };

      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", authUser.id);

      if (error) {
        // Column might not exist yet — run the migration
        if (error.code === '42703') {
          console.warn("onboarding_complete column missing. Run supabase-add-onboarding-column.sql");
          // Still mark locally so the user can proceed
          setOnboardingComplete(true);
          setUser((u) => u ? { ...u, onboardingComplete: true } : u);
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      setOnboardingComplete(true);
      setUser((u) => u ? { ...u, onboardingComplete: true } : u);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to complete onboarding" };
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setOnboardingComplete(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isNewUser,
        onboardingComplete,
        completeOnboarding,
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
