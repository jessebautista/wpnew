# WorldPianos Dataset Import Guide

This document provides comprehensive instructions for importing the recovered WorldPianos.org dataset into a new Supabase instance. Follow these steps carefully to ensure data integrity and proper migration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Schema Setup](#database-schema-setup)
3. [Data Transformation Requirements](#data-transformation-requirements)
4. [Import Procedures](#import-procedures)
5. [Data Validation](#data-validation)
6. [Post-Import Configuration](#post-import-configuration)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Supabase CLI installed (`npm install -g supabase`)
- PostgreSQL client (psql) or database management tool
- Node.js 18+ for running migration scripts
- Access to the recovered dataset files

### Supabase Project Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Note your project URL and anon key
3. Configure environment variables:
   ```bash
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Database Schema Setup

### Step 1: Initialize Supabase Schema

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('guest', 'user', 'moderator', 'admin');

-- Create moderation status enum
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- Create piano condition enum
CREATE TYPE piano_condition AS ENUM ('excellent', 'good', 'fair', 'poor', 'unknown');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    username VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Pianos table
CREATE TABLE pianos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    category VARCHAR(100),
    condition piano_condition DEFAULT 'unknown',
    accessibility_notes TEXT,
    hours_available TEXT,
    indoor BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    submitted_by UUID REFERENCES users(id),
    moderation_status moderation_status DEFAULT 'pending',
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Piano images table
CREATE TABLE piano_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    piano_id UUID REFERENCES pianos(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    uploaded_by UUID REFERENCES users(id),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location_name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    piano_id UUID REFERENCES pianos(id),
    category VARCHAR(100),
    max_attendees INTEGER,
    is_virtual BOOLEAN DEFAULT false,
    meeting_url TEXT,
    organizer_id UUID REFERENCES users(id),
    moderation_status moderation_status DEFAULT 'pending',
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category VARCHAR(100),
    tags TEXT[],
    author_id UUID REFERENCES users(id),
    published BOOLEAN DEFAULT false,
    allow_comments BOOLEAN DEFAULT true,
    moderation_status moderation_status DEFAULT 'pending',
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'piano', 'event', 'blog_post'
    content_id UUID NOT NULL,
    author_id UUID REFERENCES users(id),
    parent_id UUID REFERENCES comments(id),
    moderation_status moderation_status DEFAULT 'pending',
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (for piano ratings)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    piano_id UUID REFERENCES pianos(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    visit_date DATE,
    moderation_status moderation_status DEFAULT 'pending',
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(piano_id, author_id)
);

-- Newsletter subscriptions table
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
    source VARCHAR(100), -- 'footer', 'popup', 'api', etc.
    preferences JSONB DEFAULT '{}',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_pianos_location ON pianos(latitude, longitude);
CREATE INDEX idx_pianos_moderation ON pianos(moderation_status);
CREATE INDEX idx_pianos_verified ON pianos(verified);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_moderation ON events(moderation_status);
CREATE INDEX idx_comments_content ON comments(content_type, content_id);
CREATE INDEX idx_reviews_piano ON reviews(piano_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pianos ENABLE ROW LEVEL SECURITY;
ALTER TABLE piano_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust based on your needs)
CREATE POLICY "Public pianos are viewable by everyone" ON pianos FOR SELECT USING (moderation_status = 'approved');
CREATE POLICY "Public events are viewable by everyone" ON events FOR SELECT USING (moderation_status = 'approved');
CREATE POLICY "Public blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true AND moderation_status = 'approved');
CREATE POLICY "Public comments are viewable by everyone" ON comments FOR SELECT USING (moderation_status = 'approved');
CREATE POLICY "Public reviews are viewable by everyone" ON reviews FOR SELECT USING (moderation_status = 'approved');

-- Users can view their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
```

## Data Transformation Requirements

### Expected Data Format

Your recovered dataset should be transformed to match these specifications:

#### Users Data
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "username": "johndoe",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Piano enthusiast from NYC",
  "location": "New York, NY",
  "role": "user",
  "created_at": "2023-01-01T00:00:00Z"
}
```

#### Pianos Data
```json
{
  "name": "Central Park Piano",
  "description": "Beautiful public piano in Central Park",
  "location_name": "Central Park, NYC",
  "address": "Central Park, New York, NY 10024",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "category": "Grand Piano",
  "condition": "good",
  "accessibility_notes": "Wheelchair accessible",
  "hours_available": "24/7",
  "indoor": false,
  "verified": true,
  "submitted_by": "user_uuid",
  "moderation_status": "approved",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### Data Cleaning Rules

1. **Email Validation**: Ensure all emails are valid format
2. **Coordinate Validation**: Latitude (-90 to 90), Longitude (-180 to 180)
3. **Date Formatting**: Convert all dates to ISO 8601 format
4. **Text Sanitization**: Remove HTML tags, normalize whitespace
5. **Image URLs**: Validate and migrate image URLs if needed
6. **User Roles**: Map old roles to new enum values
7. **Status Mapping**: Convert old status values to new enums

## Import Procedures

### Step 1: Prepare Import Scripts

Create a Node.js script (`import-data.js`) for data migration:

```javascript
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function importUsers(userData) {
  console.log('Importing users...')
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
  
  if (error) {
    console.error('Error importing users:', error)
    return false
  }
  
  console.log(`Successfully imported ${data.length} users`)
  return true
}

async function importPianos(pianoData) {
  console.log('Importing pianos...')
  const { data, error } = await supabase
    .from('pianos')
    .insert(pianoData)
    .select()
  
  if (error) {
    console.error('Error importing pianos:', error)
    return false
  }
  
  console.log(`Successfully imported ${data.length} pianos`)
  return true
}

async function importEvents(eventData) {
  console.log('Importing events...')
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
  
  if (error) {
    console.error('Error importing events:', error)
    return false
  }
  
  console.log(`Successfully imported ${data.length} events`)
  return true
}

async function main() {
  try {
    // Load your data files
    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
    const pianos = JSON.parse(fs.readFileSync('./data/pianos.json', 'utf8'))
    const events = JSON.parse(fs.readFileSync('./data/events.json', 'utf8'))
    
    // Import in order (users first, then pianos, then events)
    await importUsers(users)
    await importPianos(pianos)
    await importEvents(events)
    
    console.log('Data import completed successfully!')
  } catch (error) {
    console.error('Import failed:', error)
  }
}

main()
```

### Step 2: Data Validation Script

Create a validation script (`validate-data.js`):

```javascript
const fs = require('fs')

function validateUsers(users) {
  const errors = []
  
  users.forEach((user, index) => {
    // Email validation
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      errors.push(`User ${index}: Invalid email`)
    }
    
    // Role validation
    const validRoles = ['guest', 'user', 'moderator', 'admin']
    if (user.role && !validRoles.includes(user.role)) {
      errors.push(`User ${index}: Invalid role '${user.role}'`)
    }
  })
  
  return errors
}

function validatePianos(pianos) {
  const errors = []
  
  pianos.forEach((piano, index) => {
    // Coordinate validation
    if (!piano.latitude || !piano.longitude) {
      errors.push(`Piano ${index}: Missing coordinates`)
    }
    
    if (piano.latitude < -90 || piano.latitude > 90) {
      errors.push(`Piano ${index}: Invalid latitude`)
    }
    
    if (piano.longitude < -180 || piano.longitude > 180) {
      errors.push(`Piano ${index}: Invalid longitude`)
    }
    
    // Required fields
    if (!piano.name || !piano.location_name) {
      errors.push(`Piano ${index}: Missing required fields`)
    }
  })
  
  return errors
}

function main() {
  try {
    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
    const pianos = JSON.parse(fs.readFileSync('./data/pianos.json', 'utf8'))
    
    const userErrors = validateUsers(users)
    const pianoErrors = validatePianos(pianos)
    
    if (userErrors.length > 0) {
      console.log('User validation errors:')
      userErrors.forEach(error => console.log(`  - ${error}`))
    }
    
    if (pianoErrors.length > 0) {
      console.log('Piano validation errors:')
      pianoErrors.forEach(error => console.log(`  - ${error}`))
    }
    
    if (userErrors.length === 0 && pianoErrors.length === 0) {
      console.log('All data validation passed!')
    }
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

main()
```

### Step 3: Execute Import

1. **Prepare your data files**:
   ```
   data/
   ├── users.json
   ├── pianos.json
   ├── events.json
   ├── comments.json
   ├── reviews.json
   └── blog_posts.json
   ```

2. **Install dependencies**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Validate data**:
   ```bash
   node validate-data.js
   ```

4. **Run import**:
   ```bash
   node import-data.js
   ```

## Data Validation

### Post-Import Checks

Run these SQL queries to validate the import:

```sql
-- Check record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'pianos', COUNT(*) FROM pianos
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;

-- Check for orphaned records
SELECT COUNT(*) as orphaned_pianos 
FROM pianos 
WHERE submitted_by IS NOT NULL 
AND submitted_by NOT IN (SELECT id FROM users);

-- Check coordinate validity
SELECT COUNT(*) as invalid_coordinates
FROM pianos 
WHERE latitude < -90 OR latitude > 90 
OR longitude < -180 OR longitude > 180;

-- Check moderation status distribution
SELECT moderation_status, COUNT(*) 
FROM pianos 
GROUP BY moderation_status;
```

## Post-Import Configuration

### Step 1: Update Application Configuration

Update your environment variables:

```bash
# .env.local
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 2: Configure Storage (if using images)

If your dataset includes images, set up Supabase Storage:

```sql
-- Create storage bucket for piano images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('piano-images', 'piano-images', true);

-- Create storage policy
CREATE POLICY "Piano images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'piano-images');
```

### Step 3: Set Up Authentication

Configure authentication providers in your Supabase dashboard:
- Enable Email/Password authentication
- Configure social providers if needed
- Set up email templates

## Troubleshooting

### Common Issues

1. **UUID Conflicts**: If your old data uses different ID formats:
   ```sql
   -- Generate new UUIDs for existing data
   UPDATE pianos SET id = uuid_generate_v4() WHERE id IS NULL;
   ```

2. **Foreign Key Violations**: Check for missing referenced records:
   ```sql
   -- Find pianos with invalid user references
   SELECT * FROM pianos 
   WHERE submitted_by NOT IN (SELECT id FROM users);
   ```

3. **Data Type Mismatches**: Convert data types as needed:
   ```sql
   -- Convert text coordinates to numeric
   UPDATE pianos SET 
     latitude = CAST(latitude_text AS DECIMAL(10,8)),
     longitude = CAST(longitude_text AS DECIMAL(11,8));
   ```

4. **Large Dataset Imports**: For datasets > 10k records, use batch processing:
   ```javascript
   // Process in batches of 1000
   const batchSize = 1000;
   for (let i = 0; i < data.length; i += batchSize) {
     const batch = data.slice(i, i + batchSize);
     await supabase.from('pianos').insert(batch);
   }
   ```

### Performance Optimization

1. **Disable RLS during import**:
   ```sql
   ALTER TABLE pianos DISABLE ROW LEVEL SECURITY;
   -- Re-enable after import
   ALTER TABLE pianos ENABLE ROW LEVEL SECURITY;
   ```

2. **Drop indexes during import**:
   ```sql
   DROP INDEX IF EXISTS idx_pianos_location;
   -- Recreate after import
   CREATE INDEX idx_pianos_location ON pianos(latitude, longitude);
   ```

### Rollback Procedure

If import fails, you can reset the database:

```sql
-- Truncate all tables (removes all data)
TRUNCATE users, pianos, piano_images, events, blog_posts, comments, reviews, newsletter_subscriptions CASCADE;

-- Or drop and recreate tables if needed
DROP TABLE IF EXISTS users, pianos, piano_images, events, blog_posts, comments, reviews, newsletter_subscriptions CASCADE;
```

## Support

If you encounter issues during the import process:

1. Check the Supabase logs in your dashboard
2. Validate your data format against the examples
3. Run the validation scripts before importing
4. Contact the development team with specific error messages

---

**Last Updated**: January 2024  
**Version**: 1.0  
**Compatibility**: Supabase PostgreSQL 15+