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
 * Check if email exists in credentials table
 */
export async function checkCredentials(email: string, password: string): Promise<{
  valid: boolean;
  user?: StoredCredentials;
}> {
  const { data, error } = await supabase
    .from('user_credentials')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .eq('password', password)
    .single();

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

  // If login successful, check verification status
  if (!signInError) {
    // Check if it's a demo account
    const { data: cred } = await supabase
      .from("user_credentials")
      .select("is_demo")
      .eq("email", normalizedEmail)
      .single();
    const isDemoAccount = cred?.is_demo === true;

    if (!isDemoAccount) {
      // Query the verified column from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("verified")
        .eq("id", signInData.user.id)
        .single();

      const isEmailConfirmed = !!signInData.user.email_confirmed_at;

      // If email is not confirmed or verified column is false, block access
      if (!isEmailConfirmed || (profile && profile.verified === false)) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: "Your email address is not verified. Please check your inbox and verify your email before logging in."
        };
      }
    }

    return { success: true, isNewUser: false };
  }

  // If email confirmation is enabled, signInWithPassword will fail with unconfirmed email error
  const isEmailNotConfirmed = signInError.message.toLowerCase().includes('confirm') || 
                              signInError.message.toLowerCase().includes('verify');
  if (isEmailNotConfirmed) {
    return {
      success: false,
      error: "Email confirmation is required. Please check your inbox or disable email confirmation in your Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email)."
    };
  }

  // If login failed, check if credentials exist in our table (for demo accounts)
  const credCheck = await checkCredentials(normalizedEmail, password);
  
  if (credCheck.valid && credCheck.user) {
    // Demo account found! Create Supabase Auth user
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
      if (signUpError.message.includes('already registered')) {
        // If user already exists in auth but signIn failed, passwords must be out of sync
        return {
          success: false,
          error: "Invalid email or password. (Note: Database and Supabase Auth credentials might be out of sync for this account. Please delete the user from Supabase Dashboard and try again.)"
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
          error: "Email confirmation is required. Please check your inbox or disable email confirmation in your Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email)."
        };
      }
      return { success: false, error: retryError.message };
    }

    return { success: true, isNewUser: true };
  }

  // Neither Supabase Auth nor stored credentials worked
  return { success: false, error: signInError.message || 'Invalid email or password' };
}

/**
 * Register new user (adds to both credentials table and Supabase Auth)
 */
export async function registerWithStoredCredentials(
  name: string,
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already exists in Supabase Auth
  const { data: existingAuth } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: 'test', // Just testing if user exists
  });

  // Create user in Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { name },
      emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/verify` : undefined,
    },
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      return { success: false, error: 'Email already registered. Try logging in instead.' };
    }
    return { success: false, error: signUpError.message };
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
    
    // Also store in profiles table if it exists
    await supabase
      .from('profiles')
      .update({ password })
      .eq('email', normalizedEmail);
  } catch (insertError) {
    console.error('Error storing credentials (non-critical):', insertError);
    // Don't fail signup if credential storage fails
  }

  // Auto-login after signup
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (loginError) {
    const isEmailNotConfirmed = loginError.message.toLowerCase().includes('confirm') || 
                                loginError.message.toLowerCase().includes('verify');
    if (isEmailNotConfirmed) {
      return { 
        success: true, 
        error: 'Account created! Please check your email to verify your account or disable email confirmation in your Supabase Dashboard.' 
      };
    }
    // Signup succeeded but auto-login failed
    return { 
      success: true, 
      error: 'Account created! Please login manually.' 
    };
  }

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
