-- Add piano_images, piano_visits, and comments tables
-- This migration creates the necessary tables for image uploads, ratings, and comments

-- Piano Images table for photo uploads
CREATE TABLE IF NOT EXISTS piano_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    piano_id UUID NOT NULL REFERENCES pianos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_path TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT false,
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Piano Visits table for ratings and visit tracking
CREATE TABLE IF NOT EXISTS piano_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    piano_id UUID NOT NULL REFERENCES pianos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure one rating per user per piano
    UNIQUE(piano_id, user_id)
);

-- Comments table for piano discussions
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    piano_id UUID NOT NULL REFERENCES pianos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_piano_images_piano_id ON piano_images(piano_id);
CREATE INDEX IF NOT EXISTS idx_piano_images_user_id ON piano_images(user_id);
CREATE INDEX IF NOT EXISTS idx_piano_images_moderation_status ON piano_images(moderation_status);

CREATE INDEX IF NOT EXISTS idx_piano_visits_piano_id ON piano_visits(piano_id);
CREATE INDEX IF NOT EXISTS idx_piano_visits_user_id ON piano_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_piano_visits_rating ON piano_visits(rating);

CREATE INDEX IF NOT EXISTS idx_comments_piano_id ON comments(piano_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_moderation_status ON comments(moderation_status);

-- Enable RLS on all tables
ALTER TABLE piano_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE piano_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for piano_images
CREATE POLICY "Piano images are viewable by everyone" 
    ON piano_images FOR SELECT 
    USING (moderation_status = 'approved');

CREATE POLICY "Users can insert their own piano images" 
    ON piano_images FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own piano images" 
    ON piano_images FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all piano images" 
    ON piano_images FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'moderator')
        )
    );

-- RLS Policies for piano_visits
CREATE POLICY "Piano visits are viewable by everyone" 
    ON piano_visits FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own piano visits" 
    ON piano_visits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own piano visits" 
    ON piano_visits FOR UPDATE 
    USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" 
    ON comments FOR SELECT 
    USING (moderation_status = 'approved');

CREATE POLICY "Users can insert their own comments" 
    ON comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
    ON comments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" 
    ON comments FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'moderator')
        )
    );

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_piano_images_updated_at 
    BEFORE UPDATE ON piano_images 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_piano_visits_updated_at 
    BEFORE UPDATE ON piano_visits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();