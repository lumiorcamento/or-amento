-- Migration to automate buyer profile creation and fix RLS issues
-- This trigger ensures a record is created in public.buyer_users whenever a new user signs up in auth.users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.buyer_users (user_id, name, email, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Improve RLS for buyer_users to be more resilient
-- Allows users to update their own profile even if they were just created
DROP POLICY IF EXISTS "Users can manage their own buyer profile" ON public.buyer_users;

CREATE POLICY "Users can view their own buyer profile" 
  ON public.buyer_users FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer profile" 
  ON public.buyer_users FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage profiles during signup" 
  ON public.buyer_users FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL); -- Fallback for race conditions during signup
