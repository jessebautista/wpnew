-- This file contains sample data for testing
-- Run this only in development environment

-- Insert sample admin user (you'll need to create this user through Supabase Auth first)
-- The user will be created automatically through the trigger when they sign up

-- Sample pianos data
INSERT INTO pianos (id, name, description, location_name, latitude, longitude, category, condition, accessibility, hours, verified, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Central Park Piano', 'Beautiful piano in the heart of Central Park, perfect for afternoon sessions.', 'Central Park, New York, NY, USA', 40.7829, -73.9654, 'Park', 'good', 'Wheelchair accessible', '6:00 AM - 10:00 PM', true, null),
    ('550e8400-e29b-41d4-a716-446655440001', 'JFK Airport Terminal 4', 'Piano available for travelers at JFK Airport Terminal 4.', 'JFK Airport Terminal 4, Queens, NY, USA', 40.6413, -73.7781, 'Airport', 'excellent', 'Wheelchair accessible', '24/7', true, null),
    ('550e8400-e29b-41d4-a716-446655440002', 'Times Square Piano', 'Street piano in the bustling Times Square area.', 'Times Square, New York, NY, USA', 40.7580, -73.9855, 'Street', 'fair', 'Street level', 'Daylight hours', false, null),
    ('550e8400-e29b-41d4-a716-446655440003', 'Hyde Park Corner Piano', 'Charming piano near Hyde Park Corner in London.', 'Hyde Park Corner, London, UK', 51.5074, -0.1278, 'Park', 'good', 'Wheelchair accessible', '8:00 AM - 8:00 PM', true, null),
    ('550e8400-e29b-41d4-a716-446655440004', 'St. Pancras Station Piano', 'Historic piano at the beautiful St. Pancras International station.', 'St. Pancras International, London, UK', 51.5308, -0.1261, 'Train Station', 'excellent', 'Wheelchair accessible', '5:00 AM - 1:00 AM', true, null),
    ('550e8400-e29b-41d4-a716-446655440005', 'Gare du Nord Piano', 'Piano in the main hall of Paris Gare du Nord station.', 'Gare du Nord, Paris, France', 48.8809, 2.3553, 'Train Station', 'good', 'Wheelchair accessible', '5:00 AM - 1:30 AM', true, null),
    ('550e8400-e29b-41d4-a716-446655440006', 'Sydney Opera House Piano', 'Piano near the iconic Sydney Opera House.', 'Sydney Opera House, Sydney, Australia', -33.8568, 151.2153, 'Cultural Center', 'excellent', 'Wheelchair accessible', '9:00 AM - 9:00 PM', true, null),
    ('550e8400-e29b-41d4-a716-446655440007', 'Tokyo Station Piano', 'Modern piano in Tokyo Station for commuters and travelers.', 'Tokyo Station, Tokyo, Japan', 35.6812, 139.7671, 'Train Station', 'excellent', 'Wheelchair accessible', '5:00 AM - 1:00 AM', true, null);

-- Sample events data
INSERT INTO events (id, title, description, date, location_name, latitude, longitude, category, organizer, verified, created_by) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Central Park Piano Meetup', 'Join us for a friendly piano meetup in Central Park. All skill levels welcome!', NOW() + INTERVAL '7 days', 'Central Park, New York, NY, USA', 40.7829, -73.9654, 'Meetup', 'NYC Piano Group', true, null),
    ('660e8400-e29b-41d4-a716-446655440001', 'Airport Piano Concert', 'Special concert performance at JFK Airport Terminal 4.', NOW() + INTERVAL '14 days', 'JFK Airport Terminal 4, Queens, NY, USA', 40.6413, -73.7781, 'Concert', 'JFK Cultural Events', false, null),
    ('660e8400-e29b-41d4-a716-446655440002', 'London Piano Walk', 'A walking tour of public pianos in central London.', NOW() + INTERVAL '21 days', 'London, UK', 51.5074, -0.1278, 'Community Event', 'London Piano Society', true, null),
    ('660e8400-e29b-41d4-a716-446655440003', 'Paris Piano Festival', 'Annual festival celebrating public pianos in Paris.', NOW() + INTERVAL '30 days', 'Paris, France', 48.8566, 2.3522, 'Festival', 'Ville de Paris', true, null);

-- Sample blog posts
INSERT INTO blog_posts (id, title, content, excerpt, category, tags, published, author_id) VALUES
    ('770e8400-e29b-41d4-a716-446655440000', 'The Magic of Public Pianos: Connecting Communities Through Music', 
    'Public pianos have become a beautiful phenomenon in cities worldwide, creating unexpected moments of joy and connection. From the bustling terminals of major airports to quiet park corners, these instruments serve as beacons of creativity and community spirit.

When the first public piano appeared in a London train station over a decade ago, few could have predicted the global movement it would spark. Today, thousands of public pianos grace our urban landscapes, each one a testament to the universal language of music.

What makes these pianos so special is not just their accessibility, but the stories they create. A businessman rushing to catch a flight pauses to play a gentle melody, drawing smiles from fellow travelers. A child discovers the joy of making music for the first time. A professional musician shares their gift with strangers, creating an impromptu concert that brightens everyone''s day.

The WorldPianos community has documented over 2,500 public pianos across 50 countries, each with its own unique story and character. From the ornate pianos of European train stations to the weathered but beloved instruments in city parks, these pianos represent democracy in action – music for all, by all.

But public pianos are more than just instruments; they''re catalysts for human connection. In our increasingly digital world, they offer something profoundly analog and real. They invite us to slow down, to create rather than consume, and to share our humanity through the timeless art of music.

As we continue to map and celebrate these wonderful installations, we''re reminded that sometimes the most powerful technology is also the simplest. A piano, some keys, and the courage to play – that''s all it takes to transform a space and touch lives.

Whether you''re a seasoned pianist or someone who''s never touched the keys, public pianos welcome all. They remind us that music isn''t about perfection; it''s about expression, connection, and the simple joy of making something beautiful in the world.',
    'Discover how public pianos are transforming urban spaces and bringing people together through the universal language of music.',
    'Community Stories', 
    ARRAY['community', 'public art', 'music', 'urban planning'], 
    true, null),
    
    ('770e8400-e29b-41d4-a716-446655440001', 'Piano Care: How to Maintain Public Pianos',
    'Maintaining public pianos requires special attention to weather conditions, security, and regular tuning. These beloved community instruments face unique challenges that indoor pianos never encounter.

Weather is the biggest enemy of public pianos. Rain, humidity, temperature fluctuations, and direct sunlight can all cause significant damage. Many successful public piano programs use specially treated instruments or provide protective covers during harsh weather.

Regular tuning is essential but challenging. Public pianos often require tuning every few weeks due to constant use and environmental exposure. Many cities partner with local piano technicians who volunteer their time to keep these instruments playable.

Security is another crucial consideration. While most public pianos are embraced and protected by their communities, vandalism can occur. Strategic placement, community engagement, and sometimes surveillance help protect these valuable installations.

The most successful public piano programs combine proper instrument selection, regular maintenance schedules, community involvement, and sustainable funding. Cities like London, New York, and Melbourne have developed comprehensive programs that keep their public pianos in excellent condition year-round.

Organizations like Sing for Hope and Play Me, I''m Yours have pioneered best practices for public piano installations, providing guidelines for everything from piano selection to community engagement strategies.',
    'Learn about the challenges and best practices for keeping public pianos in great condition for everyone to enjoy.',
    'Maintenance',
    ARRAY['maintenance', 'piano care', 'community', 'best practices'],
    true, null);

-- Sample newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, confirmed) VALUES
    ('test@example.com', true),
    ('piano.lover@email.com', true),
    ('music.enthusiast@test.com', false);

-- Note: User-related sample data (profiles, piano_visits, user_achievements, etc.) 
-- will be created when actual users sign up through the application