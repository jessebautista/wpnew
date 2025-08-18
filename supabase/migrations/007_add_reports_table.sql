-- Create content_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('piano', 'event', 'blog_post');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add reports table for content reporting
CREATE TABLE reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content_type content_type NOT NULL,
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    -- Prevent duplicate reports from same user for same content
    UNIQUE(user_id, content_type, content_id)
);

-- Add indexes for reports
CREATE INDEX idx_reports_content ON reports(content_type, content_id);
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Add updated_at trigger for reports
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view their own reports" ON reports
    FOR SELECT USING (auth.uid() = user_id);

-- Anyone can create reports (anonymous reporting allowed)
CREATE POLICY "Anyone can create reports" ON reports
    FOR INSERT WITH CHECK (true);

-- Only admins/moderators can view all reports and update them
CREATE POLICY "Moderators can manage all reports" ON reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'moderator')
        )
    );