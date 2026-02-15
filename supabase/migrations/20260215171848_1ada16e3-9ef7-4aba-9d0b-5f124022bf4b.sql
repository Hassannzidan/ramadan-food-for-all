
-- Drop the existing policy
DROP POLICY "Admins can view roles" ON public.user_roles;

-- Allow authenticated users to read their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);
