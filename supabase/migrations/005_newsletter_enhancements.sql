-- Newsletter table enhancements
-- This migration adds the necessary columns to support full newsletter functionality

-- Add missing columns to newsletter_subscriptions table
DO $$ 
BEGIN
    -- Add first_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'first_name') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN first_name TEXT;
    END IF;
    
    -- Add last_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'last_name') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN last_name TEXT;
    END IF;
    
    -- Add status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'status') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced'));
    END IF;
    
    -- Add source if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'source') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN source TEXT DEFAULT 'website';
    END IF;
    
    -- Add subscribed_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'subscribed_at') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN subscribed_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Add unsubscribed_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'unsubscribed_at') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN unsubscribed_at TIMESTAMPTZ;
    END IF;
    
    -- Add preferences if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'preferences') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN preferences JSONB DEFAULT '{"weekly_digest": true, "event_notifications": true, "new_piano_alerts": true, "blog_updates": true}';
    END IF;
    
    -- Add tags if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'tags') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN tags TEXT[] DEFAULT ARRAY['website'];
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions' AND column_name = 'updated_at') THEN
        ALTER TABLE newsletter_subscriptions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Update existing records to have the new default values
UPDATE newsletter_subscriptions 
SET 
    status = COALESCE(status, 'active'),
    source = COALESCE(source, 'website'),
    subscribed_at = COALESCE(subscribed_at, NOW()),
    preferences = COALESCE(preferences, '{"weekly_digest": true, "event_notifications": true, "new_piano_alerts": true, "blog_updates": true}'::jsonb),
    tags = COALESCE(tags, ARRAY['website']),
    updated_at = COALESCE(updated_at, NOW())
WHERE status IS NULL OR source IS NULL OR subscribed_at IS NULL OR preferences IS NULL OR tags IS NULL OR updated_at IS NULL;

-- Create indexes for performance
DO $$
BEGIN
    -- Email index (if not exists)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'newsletter_subscriptions' AND indexname = 'idx_newsletter_subscriptions_email') THEN
        CREATE INDEX idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
    END IF;
    
    -- Status index (if not exists)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'newsletter_subscriptions' AND indexname = 'idx_newsletter_subscriptions_status') THEN
        CREATE INDEX idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);
    END IF;
    
    -- Source index (if not exists)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'newsletter_subscriptions' AND indexname = 'idx_newsletter_subscriptions_source') THEN
        CREATE INDEX idx_newsletter_subscriptions_source ON newsletter_subscriptions(source);
    END IF;
    
    -- Subscribed_at index (if not exists)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'newsletter_subscriptions' AND indexname = 'idx_newsletter_subscriptions_subscribed_at') THEN
        CREATE INDEX idx_newsletter_subscriptions_subscribed_at ON newsletter_subscriptions(subscribed_at);
    END IF;
END $$;

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger for newsletter_subscriptions if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_newsletter_subscriptions_updated_at') THEN
        CREATE TRIGGER update_newsletter_subscriptions_updated_at 
        BEFORE UPDATE ON newsletter_subscriptions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Update the database types to reflect the new schema
COMMENT ON TABLE newsletter_subscriptions IS 'Enhanced newsletter subscriptions with full management capabilities';
COMMENT ON COLUMN newsletter_subscriptions.first_name IS 'Subscriber first name (optional)';
COMMENT ON COLUMN newsletter_subscriptions.last_name IS 'Subscriber last name (optional)';
COMMENT ON COLUMN newsletter_subscriptions.status IS 'Subscription status: active, unsubscribed, or bounced';
COMMENT ON COLUMN newsletter_subscriptions.source IS 'Where the subscriber signed up from';
COMMENT ON COLUMN newsletter_subscriptions.subscribed_at IS 'When the user first subscribed';
COMMENT ON COLUMN newsletter_subscriptions.unsubscribed_at IS 'When the user unsubscribed (if applicable)';
COMMENT ON COLUMN newsletter_subscriptions.preferences IS 'JSON object with email preferences';
COMMENT ON COLUMN newsletter_subscriptions.tags IS 'Array of tags for segmentation';