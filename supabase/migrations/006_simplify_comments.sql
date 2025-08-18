-- Simplify comments: remove authentication requirement, add captcha support
-- Drop existing policies and create new ones that allow anyone to comment

DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
DROP POLICY IF EXISTS "Moderators and admins can manage any comment" ON comments;

-- Add author_name field for display names
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Simple policies: anyone can read and create comments
CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create comments" ON comments
    FOR INSERT WITH CHECK (true);

-- For now, disable updates/deletes since we don't have profiles table
-- This can be re-enabled later when needed
-- CREATE POLICY "Moderators can manage comments" ON comments
--     FOR ALL USING (false);