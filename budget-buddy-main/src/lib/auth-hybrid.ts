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

  // If login successful, we're done!
  if (!signInError) {
    return { success: true, isNewUser: false };
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

    if (signUpError && !signUpError.message.includes('already registered')) {
      return { success: false, error: signUpError.message };
    }

    // Try login again
    const { error: retryError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (retryError) {
      return { success: false, error: retryError.message };
    }

    return { success: true, isNewUser: true };
  }

  // Neither Supabase Auth nor stored credentials worked
  return { success: false, error: 'Invalid email or password' };
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
      emailRedirectTo: undefined, // Don't require email confirmation
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
