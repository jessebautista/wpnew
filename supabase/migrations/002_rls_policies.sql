-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pianos ENABLE ROW LEVEL SECURITY;
ALTER TABLE piano_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE piano_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_interests ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin or moderator
CREATE OR REPLACE FUNCTION is_admin_or_moderator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role IN ('admin', 'moderator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (is_admin_or_moderator(auth.uid()));

-- Pianos policies
CREATE POLICY "Anyone can view pianos" ON pianos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create pianos" ON pianos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own pianos" ON pianos
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Moderators and admins can update any piano" ON pianos
    FOR UPDATE USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Moderators and admins can delete pianos" ON pianos
    FOR DELETE USING (is_admin_or_moderator(auth.uid()));

-- Piano images policies
CREATE POLICY "Anyone can view piano images" ON piano_images
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add piano images" ON piano_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Piano creators and moderators can manage piano images" ON piano_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pianos 
            WHERE pianos.id = piano_images.piano_id 
            AND (pianos.created_by = auth.uid() OR is_admin_or_moderator(auth.uid()))
        )
    );

-- Events policies
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own events" ON events
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Moderators and admins can update any event" ON events
    FOR UPDATE USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Moderators and admins can delete events" ON events
    FOR DELETE USING (is_admin_or_moderator(auth.uid()));

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
    FOR SELECT USING (published = true OR is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins and moderators can create blog posts" ON blog_posts
    FOR INSERT WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Authors can update their own blog posts" ON blog_posts
    FOR UPDATE USING (auth.uid() = author_id OR is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete blog posts" ON blog_posts
    FOR DELETE USING (is_admin_or_moderator(auth.uid()));

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Moderators and admins can manage any comment" ON comments
    FOR ALL USING (is_admin_or_moderator(auth.uid()));

-- Newsletter subscriptions policies
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Users can unsubscribe using email" ON newsletter_subscriptions
    FOR DELETE USING (true); -- Will be handled by application logic

-- Piano visits policies
CREATE POLICY "Users can view their own piano visits" ON piano_visits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own piano visits" ON piano_visits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own piano visits" ON piano_visits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own piano visits" ON piano_visits
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all piano visits" ON piano_visits
    FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create achievements" ON user_achievements
    FOR INSERT WITH CHECK (true); -- Handled by application logic/triggers

CREATE POLICY "Admins can manage all achievements" ON user_achievements
    FOR ALL USING (is_admin_or_moderator(auth.uid()));

-- Event interests policies
CREATE POLICY "Users can view their own event interests" ON event_interests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own event interests" ON event_interests
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Event creators can view interests in their events" ON event_interests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_interests.event_id 
            AND events.created_by = auth.uid()
        )
    );

CREATE POLICY "Admins can view all event interests" ON event_interests
    FOR SELECT USING (is_admin_or_moderator(auth.uid()));