/**
 * Hybrid Authentication System
 * 
 * This supports both:
 * 1. Database-stored credentials (for demo/testing)
 * 2. Real Supabase authentication (for production)
 */

import { supabase } from './supabase';

export interface StoredCredentials {
  email: string;
  password: string;
  name: string;
  is_demo: boolean;
}

/**
 * Fetch all demo user credentials from database
 */
export async function getDemoCredentials(): Promise<StoredCredentials[]> {
  const { data, error } = await supabase
    .from('user_credentials')
    .select('email, password, name, is_demo')
    .eq('is_demo', true);

  if (error) {
    console.error('Error fetching credentials:', error);
    return [];
  }

  return data || [];
}

/**
 * Check if email exists in credentials table (with hardcoded fallback for built-in demo user)
 */
export async function checkCredentials(email: string, password: string): Promise<{
  valid: boolean;
  user?: StoredCredentials;
}> {
  const cleanEmail = email.toLowerCase().trim();

  // Built-in fallback check for primary demo user
  if (cleanEmail === "demo@budgetbuddy.com" && (password === "Demo@1234" || password === "Demo@5678")) {
    return {
      valid: true,
      user: {
        email: "demo@budgetbuddy.com",
        password: password,
        name: "Demo User",
        is_demo: true,
      },
    };
  }

  try {
    const { data, error } = await supabase
      .from('user_credentials')
      .select('*')
      .eq('email', cleanEmail)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      return { valid: false };
    }

    return {
      valid: true,
      user: {
        email: data.email,
        password: data.password,
        name: data.name,
        is_demo: data.is_demo,
      },
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Login with database credentials (creates Supabase auth user if needed)
 */
export async function loginWithStoredCredentials(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
  isNewUser?: boolean;
}> {
  const normalizedEmail = email.toLowerCase().trim();

  // First, try to login with Supabase Auth directly
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  // If login successful, we're done!
  if (!signInError && signInData?.session) {
    return { success: true, isNewUser: false };
  }

  // If email confirmation is enabled on Supabase, signInWithPassword will fail with unconfirmed email error
  const isEmailNotConfirmed = signInError?.message.toLowerCase().includes('confirm') || 
                              signInError?.message.toLowerCase().includes('verify');
  if (isEmailNotConfirmed) {
    return {
      success: false,
      error: "Email confirmation is required. Please check your inbox or disable email confirmation in your Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email)."
    };
  }

  // Self-healing attempt for demo user: test candidate demo passwords in case Auth and DB passwords got out of sync
  if (normalizedEmail === 'demo@budgetbuddy.com') {
    const candidateDemoPasswords = ['Demo@1234', 'Demo@5678', 'demo1234', 'Demo1234!', 'demo123', 'Demo@123'];
    for (const candPwd of candidateDemoPasswords) {
      if (candPwd === password) continue; // Already tried above
      const { data: candData, error: candError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: candPwd,
      });
      if (!candError && candData?.session) {
        // Sync password in user_credentials table so future logins use the new password
        supabase.from('user_credentials').upsert({
          email: normalizedEmail,
          password: candPwd,
          name: 'Demo User',
          is_demo: true,
        }).then(() => {}).catch(() => {});
        return { success: true, isNewUser: false };
      }
    }
  }

  // If login failed, check if credentials exist in our table (for demo accounts)
  const credCheck = await checkCredentials(normalizedEmail, password);
  
  if (credCheck.valid && credCheck.user) {
    // Demo account found! Attempt to create Supabase Auth user
    const { error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: credCheck.user.name,
        },
        emailRedirectTo: undefined, // Don't send confirmation email
      },
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
        // Try candidate passwords one more time
        if (normalizedEmail === 'demo@budgetbuddy.com') {
          const candidateDemoPasswords = ['Demo@1234', 'Demo@5678', 'demo1234', 'Demo1234!', 'demo123'];
          for (const candPwd of candidateDemoPasswords) {
            const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password: candPwd,
            });
            if (!retryErr && retryData?.session) {
              return { success: true, isNewUser: false };
            }
          }
        }
        return {
          success: false,
          error: "Invalid email or password. If you recently changed the password for this account, please use your updated password or request a password reset."
        };
      }
      return { success: false, error: signUpError.message };
    }

    // Try login again
    const { error: retryError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (retryError) {
      const retryEmailUnconfirmed = retryError.message.toLowerCase().includes('confirm') || 
                                    retryError.message.toLowerCase().includes('verify');
      if (retryEmailUnconfirmed) {
        return {
          success: false,
          error: "Email confirmation is required for this account. Please check your inbox or click 'Forgot Password' to reset your credentials."
        };
      }
      return { success: false, error: retryError.message };
    }

    return { success: true, isNewUser: true };
  }

  // Neither Supabase Auth nor stored credentials worked
  return { success: false, error: signInError?.message || 'Invalid email or password' };
}

/**
 * Register new user (adds to both credentials table and Supabase Auth)
 */
/**
 * Validate password rules:
 * - Length: 9-25 characters
 * - Must contain at least 2 alphabetic characters (a-z, A-Z), 1 number (0-9), and 1 special character
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 9 || password.length > 25) {
    return { valid: false, error: "Password must be between 9 and 25 characters long." };
  }

  const alphabets = password.match(/[a-zA-Z]/g) || [];
  const numbers = password.match(/[0-9]/g) || [];
  const specialChars = password.match(/[^a-zA-Z0-9]/g) || [];

  if (alphabets.length < 2) {
    return { valid: false, error: "Password must contain at least 2 alphabetic characters." };
  }

  if (numbers.length < 1) {
    return { valid: false, error: "Password must contain at least 1 number." };
  }

  if (specialChars.length < 1) {
    return { valid: false, error: "Password must contain at least 1 special character." };
  }

  // Check for control/non-printable characters (ASCII 0-31, 127)
  const hasControlChars = /[\x00-\x1F\x7F]/.test(password);
  if (hasControlChars) {
    return { valid: false, error: "Password contains invalid non-printable characters." };
  }

  return { valid: true };
}

export async function registerWithStoredCredentials(
  name: string,
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  alreadyRegisteredUnverified?: boolean;
}> {
  const normalizedEmail = email.toLowerCase().trim();

  // Validate password middleware
  const pwdValidation = validatePassword(password);
  if (!pwdValidation.valid) {
    return { success: false, error: pwdValidation.error };
  }

  // Check if email already exists in profiles table (safer than signInWithPassword)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingProfile) {
    return { success: false, error: 'This email is already registered. Try logging in instead.' };
  }

  // Create user in Supabase Auth
  // NOTE: If SMTP is not configured, Supabase will silently succeed but NOT send email.
  // Make sure: Dashboard → Auth → SMTP is configured and "Confirm email" is ON.
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { name },
      emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/verify` : undefined,
    },
  });

  if (signUpError) {
    if (
      signUpError.message.includes('already registered') ||
      signUpError.message.includes('already exists') ||
      signUpError.message.includes('User already registered')
    ) {
      return { success: false, error: 'This email is already registered. Try logging in instead.' };
    }
    return { success: false, error: signUpError.message };
  }

  // Supabase returns a fake-success with identities=[] when the email already
  // exists as an UNVERIFIED user. No email is sent in this case.
  if (
    signUpData?.user &&
    Array.isArray(signUpData.user.identities) &&
    signUpData.user.identities.length === 0
  ) {
    return {
      success: false,
      alreadyRegisteredUnverified: true,
      error: 'An account with this email already exists but is not verified. Please check your inbox for the original verification email, or use the login page to resend it.',
    };
  }

  // Store credentials in database for easy access
  try {
    await supabase
      .from('user_credentials')
      .insert({
        email: normalizedEmail,
        password,
        name,
        is_demo: false,
      });
  } catch (insertError) {
    console.error('Error storing credentials (non-critical):', insertError);
    // Don't fail signup if credential storage fails
  }

  // If Supabase returned a session directly, email confirmation is OFF
  if (signUpData?.session) {
    return { success: true };
  }

  // Email confirmation is ON — Supabase sent the verification email
  return { success: true };
}

/**
 * Get all available demo accounts
 */
export async function getAvailableDemoAccounts(): Promise<Array<{
  email: string;
  password: string;
  name: string;
}>> {
  const credentials = await getDemoCredentials();
  return credentials.map(cred => ({
    email: cred.email,
    password: cred.password,
    name: cred.name,
  }));
}

/**
 * Change user password (updates both Supabase Auth and credentials table)
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Verify current password by trying to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (verifyError) {
    return { success: false, error: 'Current password is incorrect' };
  }

  // Update password in Supabase Auth
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Update password in credentials table (if exists)
  const { error: dbError } = await supabase
    .from('user_credentials')
    .update({ password: newPassword })
    .eq('email', user.email!.toLowerCase().trim());

  if (dbError) {
    console.error('Error updating password in credentials table:', dbError);
    // Don't fail the password change just because DB update failed
  }

  // Update password in profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ password: newPassword })
    .eq('email', user.email!.toLowerCase().trim());

  if (profileError) {
    console.error('Error updating password in profiles table:', profileError);
    // Don't fail the password change just because DB update failed
  }

  return { success: true };
}
