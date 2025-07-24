-- Function to handle user profile creation after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'username', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to search pianos with location radius
CREATE OR REPLACE FUNCTION search_pianos_near_location(
    search_lat DECIMAL,
    search_lng DECIMAL,
    radius_km INTEGER DEFAULT 50,
    search_query TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL,
    condition_filter TEXT DEFAULT NULL,
    verified_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    location_name TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    category TEXT,
    condition piano_condition,
    accessibility TEXT,
    hours TEXT,
    verified BOOLEAN,
    created_by UUID,
    verified_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.location_name,
        p.latitude,
        p.longitude,
        p.category,
        p.condition,
        p.accessibility,
        p.hours,
        p.verified,
        p.created_by,
        p.verified_by,
        p.created_at,
        p.updated_at,
        ROUND(
            ST_Distance(
                ST_Point(search_lng, search_lat)::geography,
                ST_Point(p.longitude, p.latitude)::geography
            ) / 1000, 2
        ) as distance_km
    FROM pianos p
    WHERE 
        ST_DWithin(
            ST_Point(search_lng, search_lat)::geography,
            ST_Point(p.longitude, p.latitude)::geography,
            radius_km * 1000
        )
        AND (search_query IS NULL OR (
            p.name ILIKE '%' || search_query || '%' OR
            p.location_name ILIKE '%' || search_query || '%' OR
            p.description ILIKE '%' || search_query || '%'
        ))
        AND (category_filter IS NULL OR p.category = category_filter)
        AND (condition_filter IS NULL OR p.condition::TEXT = condition_filter)
        AND (NOT verified_only OR p.verified = TRUE)
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get piano statistics for a user (Piano Passport)
CREATE OR REPLACE FUNCTION get_user_piano_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'pianos_added', (
            SELECT COUNT(*) FROM pianos WHERE created_by = user_uuid
        ),
        'pianos_visited', (
            SELECT COUNT(*) FROM piano_visits WHERE user_id = user_uuid
        ),
        'events_created', (
            SELECT COUNT(*) FROM events WHERE created_by = user_uuid
        ),
        'events_interested', (
            SELECT COUNT(*) FROM event_interests WHERE user_id = user_uuid AND interested = TRUE
        ),
        'achievements_earned', (
            SELECT COUNT(*) FROM user_achievements WHERE user_id = user_uuid
        ),
        'countries_visited', (
            SELECT COUNT(DISTINCT 
                CASE 
                    WHEN p.location_name LIKE '%USA%' OR p.location_name LIKE '%United States%' THEN 'USA'
                    WHEN p.location_name LIKE '%UK%' OR p.location_name LIKE '%United Kingdom%' THEN 'UK'
                    WHEN p.location_name LIKE '%Canada%' THEN 'Canada'
                    WHEN p.location_name LIKE '%Australia%' THEN 'Australia'
                    WHEN p.location_name LIKE '%Germany%' THEN 'Germany'
                    WHEN p.location_name LIKE '%France%' THEN 'France'
                    WHEN p.location_name LIKE '%Japan%' THEN 'Japan'
                    ELSE 'Other'
                END
            )
            FROM piano_visits pv
            JOIN pianos p ON pv.piano_id = p.id
            WHERE pv.user_id = user_uuid
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    pianos_added INTEGER;
    pianos_visited INTEGER;
    countries_count INTEGER;
BEGIN
    -- Get current stats
    SELECT COUNT(*) INTO pianos_added FROM pianos WHERE created_by = user_uuid;
    SELECT COUNT(*) INTO pianos_visited FROM piano_visits WHERE user_id = user_uuid;
    
    -- Award "First Piano Added" achievement
    IF pianos_added >= 1 AND NOT EXISTS (
        SELECT 1 FROM user_achievements 
        WHERE user_id = user_uuid AND achievement_type = 'first_piano_added'
    ) THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description)
        VALUES (user_uuid, 'first_piano_added', 'Piano Pioneer', 'Added your first piano to the map');
    END IF;
    
    -- Award "Piano Contributor" achievement (10 pianos)
    IF pianos_added >= 10 AND NOT EXISTS (
        SELECT 1 FROM user_achievements 
        WHERE user_id = user_uuid AND achievement_type = 'piano_contributor'
    ) THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description)
        VALUES (user_uuid, 'piano_contributor', 'Piano Contributor', 'Added 10 pianos to the map');
    END IF;
    
    -- Award "First Visit" achievement
    IF pianos_visited >= 1 AND NOT EXISTS (
        SELECT 1 FROM user_achievements 
        WHERE user_id = user_uuid AND achievement_type = 'first_visit'
    ) THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description)
        VALUES (user_uuid, 'first_visit', 'First Keys', 'Visited your first public piano');
    END IF;
    
    -- Award "Piano Explorer" achievement (25 visits)
    IF pianos_visited >= 25 AND NOT EXISTS (
        SELECT 1 FROM user_achievements 
        WHERE user_id = user_uuid AND achievement_type = 'piano_explorer'
    ) THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description)
        VALUES (user_uuid, 'piano_explorer', 'Piano Explorer', 'Visited 25 different pianos');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent activity for homepage
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    activity_type TEXT,
    title TEXT,
    description TEXT,
    user_name TEXT,
    created_at TIMESTAMPTZ,
    item_id UUID
) AS $$
BEGIN
    RETURN QUERY
    (
        SELECT 
            'piano_added'::TEXT,
            p.name,
            p.location_name,
            COALESCE(pr.full_name, pr.username, 'Anonymous'),
            p.created_at,
            p.id
        FROM pianos p
        LEFT JOIN profiles pr ON p.created_by = pr.id
        WHERE p.verified = TRUE
        ORDER BY p.created_at DESC
        LIMIT limit_count / 2
    )
    UNION ALL
    (
        SELECT 
            'event_added'::TEXT,
            e.title,
            e.location_name,
            COALESCE(pr.full_name, pr.username, 'Anonymous'),
            e.created_at,
            e.id
        FROM events e
        LEFT JOIN profiles pr ON e.created_by = pr.id
        WHERE e.verified = TRUE AND e.date > NOW()
        ORDER BY e.created_at DESC
        LIMIT limit_count / 2
    )
    ORDER BY created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get piano with images and stats
CREATE OR REPLACE FUNCTION get_piano_details(piano_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'piano', row_to_json(p.*),
        'images', COALESCE(
            (SELECT json_agg(row_to_json(pi.*)) FROM piano_images pi WHERE pi.piano_id = piano_uuid),
            '[]'::json
        ),
        'author', row_to_json(pr.*),
        'visit_count', (SELECT COUNT(*) FROM piano_visits WHERE piano_id = piano_uuid),
        'comment_count', (SELECT COUNT(*) FROM comments WHERE content_type = 'piano' AND content_id = piano_uuid)
    ) INTO result
    FROM pianos p
    LEFT JOIN profiles pr ON p.created_by = pr.id
    WHERE p.id = piano_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;