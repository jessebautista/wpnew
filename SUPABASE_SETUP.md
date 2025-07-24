# Supabase Setup Guide for WorldPianos.org

This guide will help you set up the Supabase backend for the WorldPianos application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Basic familiarity with SQL and database concepts

## Step 1: Create a New Supabase Project

1. Log in to your Supabase dashboard
2. Click "New Project"
3. Choose your organization
4. Fill in the project details:
   - **Name**: WorldPianos
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (usually 2-3 minutes)

## Step 2: Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Navigate to "API"
4. Copy the following values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **Anon key** (starts with `eyJhbGci...`)

## Step 3: Configure Environment Variables

1. In your project root, update the `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Restart your development server after updating the environment variables

## Step 4: Run Database Migrations

You have two options to set up the database schema:

### Option A: Using the Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the sidebar
3. Copy and paste the contents of each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_functions.sql`
   - `supabase/migrations/004_sample_data.sql` (optional, for test data)
4. Run each migration by clicking "Run"

### Option B: Using Supabase CLI (Advanced)

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Initialize Supabase in your project:
```bash
supabase init
```

4. Link to your remote project:
```bash
supabase link --project-ref your-project-id
```

5. Push the migrations:
```bash
supabase db push
```

## Step 5: Configure Authentication

1. Go to "Authentication" > "Settings" in your Supabase dashboard
2. Configure the following settings:

### Site URL
- Set to your development URL: `http://localhost:5173`
- For production, update to your actual domain

### Email Templates (Optional)
- Customize the email templates for signup confirmation, password reset, etc.
- You can find templates under "Authentication" > "Email Templates"

### Auth Providers (Optional)
- Enable social logins if desired (Google, GitHub, etc.)
- Configure OAuth apps and add credentials

## Step 6: Set Up Storage (For Image Uploads)

1. Go to "Storage" in your Supabase dashboard
2. Create a new bucket called `piano-images`
3. Set the bucket to "Public" for easier image access
4. Configure the bucket policy:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'piano-images' AND 
  auth.role() = 'authenticated'
);

-- Allow public access to view images
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'piano-images');
```

## Step 7: Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Check that the application loads without errors
3. Try creating a test account to verify authentication works
4. Check the Supabase dashboard to see if the user appears in the "Authentication" section

## Step 8: Set Up Row Level Security (RLS)

The migration files include comprehensive RLS policies, but you should verify they're active:

1. Go to "Authentication" > "Policies" in your Supabase dashboard
2. Verify that all tables have policies enabled
3. Test that users can only access their own data appropriately

## Step 9: Configure Real-time (Optional)

For real-time features like live comments or notifications:

1. Go to "Database" > "Replication" in your Supabase dashboard
2. Enable replication for tables that need real-time updates:
   - `comments`
   - `piano_visits`
   - `event_interests`

## Step 10: Production Configuration

When deploying to production:

1. Update your environment variables with production URLs
2. Configure proper CORS settings in Supabase
3. Set up proper backup strategies
4. Enable audit logging if needed
5. Configure monitoring and alerts

## Database Schema Overview

The database includes the following main tables:

- **profiles**: User profiles extending Supabase auth
- **pianos**: Public piano listings with location data
- **piano_images**: Images associated with pianos
- **events**: Piano-related events and meetups  
- **blog_posts**: Blog content and articles
- **comments**: Comments on pianos, events, and blog posts
- **piano_visits**: User visits to pianos (for Piano Passport)
- **user_achievements**: Achievement system for gamification
- **event_interests**: User interest in events
- **newsletter_subscriptions**: Email newsletter signups

## Security Features

- Row Level Security (RLS) on all tables
- Role-based access control (user, moderator, admin)
- Secure image uploads with proper policies
- Rate limiting and abuse prevention
- Audit trails for administrative actions

## Troubleshooting

### Common Issues

1. **"relation does not exist" errors**: Make sure all migrations ran successfully in order
2. **Permission denied errors**: Check that RLS policies are correctly configured
3. **Authentication issues**: Verify environment variables and Site URL settings
4. **CORS errors**: Configure allowed origins in Supabase dashboard

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Visit the [Supabase Discord community](https://discord.supabase.com)
- Create an issue in the project repository

## Maintenance

Regular tasks:
- Monitor database performance and optimize queries
- Review and update RLS policies as needed
- Back up important data regularly
- Keep Supabase and dependencies updated
- Monitor usage and costs

---

Your Supabase backend is now ready for the WorldPianos application!