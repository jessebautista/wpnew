-- Fix pianos table schema to ensure created_by column exists
-- This migration ensures the created_by column is present and properly configured

-- Check if the column exists, and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pianos' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE pianos ADD COLUMN created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Also ensure we have the other required columns that might be missing
DO $$
BEGIN
    -- Check for submitted_by column (might be used instead of created_by)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pianos' AND column_name = 'submitted_by'
    ) THEN
        -- Add submitted_by if it doesn't exist
        ALTER TABLE pianos ADD COLUMN submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;

    -- Check for moderation_status column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pianos' AND column_name = 'moderation_status'
    ) THEN
        -- Add moderation_status if it doesn't exist
        ALTER TABLE pianos ADD COLUMN moderation_status TEXT DEFAULT 'pending';
    END IF;

    -- Check for hours_available column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pianos' AND column_name = 'hours_available'
    ) THEN
        -- Add hours_available if it doesn't exist (alias for hours)
        ALTER TABLE pianos ADD COLUMN hours_available TEXT;
    END IF;
END $$;

-- Update existing pianos to have proper moderation status if needed
UPDATE pianos SET moderation_status = 'approved' WHERE moderation_status IS NULL AND verified = true;
UPDATE pianos SET moderation_status = 'pending' WHERE moderation_status IS NULL AND verified = false;

-- Create index on created_by if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_pianos_created_by ON pianos(created_by);
CREATE INDEX IF NOT EXISTS idx_pianos_moderation_status ON pianos(moderation_status);