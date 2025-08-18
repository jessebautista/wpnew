-- Fix comments RLS policy to use proper authentication check
-- Drop the existing policy and recreate with correct condition

DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;

CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);