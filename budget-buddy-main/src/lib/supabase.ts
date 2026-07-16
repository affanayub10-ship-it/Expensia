import { createClient } from '@supabase/supabase-js';

// Get environment variables - with fallbacks for SSR safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only throw error on client-side where these are definitely needed
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Fallback for SSR - will be replaced on client

// Database types for type safety
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar: string | null;
          password: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar?: string | null;
          password?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar?: string | null;
          password?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          amount: number;
          date: string;
          category: string;
          location: string | null;
          notes: string | null;
          tags: string[];
          status: string;
          recurrence: string;
          receipt: string | null;
          deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          amount: number;
          date: string;
          category: string;
          location?: string | null;
          notes?: string | null;
          tags?: string[];
          status?: string;
          recurrence?: string;
          receipt?: string | null;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          amount?: number;
          date?: string;
          category?: string;
          location?: string | null;
          notes?: string | null;
          tags?: string[];
          status?: string;
          recurrence?: string;
          receipt?: string | null;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      income: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          amount: number;
          date: string;
          category: string;
          recurrence: string;
          next_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source: string;
          amount: number;
          date: string;
          category: string;
          recurrence?: string;
          next_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source?: string;
          amount?: number;
          date?: string;
          category?: string;
          recurrence?: string;
          next_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          limit_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          limit_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          limit_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          user_id: string;
          timezone: string;
          date_format: string;
          language: string;
          default_category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          timezone?: string;
          date_format?: string;
          language?: string;
          default_category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          timezone?: string;
          date_format?: string;
          language?: string;
          default_category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_amount: number;
          current_amount: number;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          target_amount: number;
          current_amount?: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          target_amount?: number;
          current_amount?: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      savings_contributions: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string;
          amount: number;
          type: string;
          date: string;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id: string;
          amount: number;
          type: string;
          date: string;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string;
          amount?: number;
          type?: string;
          date?: string;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
