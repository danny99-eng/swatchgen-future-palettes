-- Add typography_analyses_today column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS typography_analyses_today integer NOT NULL DEFAULT 0;

-- Create typography_analyses table
CREATE TABLE IF NOT EXISTS public.typography_analyses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  analysis_result jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.typography_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for typography_analyses
CREATE POLICY "Users can view own analyses" 
ON public.typography_analyses 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" 
ON public.typography_analyses 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" 
ON public.typography_analyses 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analyses" 
ON public.typography_analyses 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to reset typography count
CREATE OR REPLACE FUNCTION public.reset_typography_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET typography_analyses_today = 0,
      last_reset = now()
  WHERE last_reset < CURRENT_DATE;
END;
$$;