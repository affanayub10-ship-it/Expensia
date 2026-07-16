-- Create savings_goals table
CREATE TABLE public.savings_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create savings_contributions table (tracks individual contributions)
CREATE TABLE public.savings_contributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.savings_goals(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'deposit', -- 'deposit' or 'withdrawal'
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_savings_goals_user_id ON public.savings_goals(user_id);
CREATE INDEX idx_savings_contributions_user_id ON public.savings_contributions(user_id);
CREATE INDEX idx_savings_contributions_goal_id ON public.savings_contributions(goal_id);
CREATE INDEX idx_savings_contributions_date ON public.savings_contributions(date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_contributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for savings_goals
CREATE POLICY "Users can view their own savings goals"
  ON public.savings_goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings goals"
  ON public.savings_goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals"
  ON public.savings_goals
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals"
  ON public.savings_goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for savings_contributions
CREATE POLICY "Users can view their own savings contributions"
  ON public.savings_contributions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings contributions"
  ON public.savings_contributions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings contributions"
  ON public.savings_contributions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings contributions"
  ON public.savings_contributions
  FOR DELETE
  USING (auth.uid() = user_id);
