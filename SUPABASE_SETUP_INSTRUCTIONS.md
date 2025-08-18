# Database Setup - What We Need

## 1. Run this SQL to create the tables:

```sql
-- Create piano_visits table (missing)
CREATE TABLE piano_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    piano_id UUID REFERENCES pianos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(piano_id, user_id)
);

-- Create event_interests table (missing)
CREATE TABLE event_interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interested BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_piano_visits_piano_id ON piano_visits(piano_id);
CREATE INDEX IF NOT EXISTS idx_piano_visits_user_id ON piano_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_event_interests_event_id ON event_interests(event_id);
CREATE INDEX IF NOT EXISTS idx_event_interests_user_id ON event_interests(user_id);
```

## 2. Disable RLS on piano_images table

Run this SQL to completely disable RLS:

```sql
-- Disable RLS on piano_images table
ALTER TABLE piano_images DISABLE ROW LEVEL SECURITY;
```

## 3. Fix Storage Bucket RLS

Go to Storage → piano-images → Policies and run this SQL:

```sql
-- Allow authenticated users to upload to piano-images bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'piano-images' AND 
  auth.role() = 'authenticated'
);

-- Allow anyone to view piano images
CREATE POLICY "Anyone can view piano images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'piano-images'
);
```

Or alternatively, **disable RLS entirely on the storage bucket** by going to Settings and unchecking "Enable RLS".