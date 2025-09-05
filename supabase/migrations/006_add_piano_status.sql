-- Add piano status system
-- This migration adds a status column to track piano availability and condition

-- Add status column to pianos table
ALTER TABLE pianos 
ADD COLUMN status TEXT DEFAULT 'Available' 
CHECK (status IN ('Unknown', 'Available', 'Unplayable', 'Archived'));

-- Update existing records to have 'Available' status
-- Most entries are from Sing for Hope and are verified as available
UPDATE pianos 
SET status = 'Available' 
WHERE status IS NULL;

-- Create index for performance on status queries
CREATE INDEX IF NOT EXISTS idx_pianos_status ON pianos(status);

-- Add helpful comment
COMMENT ON COLUMN pianos.status IS 'Piano availability status: Unknown, Available, Unplayable, or Archived';

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Piano status system migration completed successfully!';
    RAISE NOTICE 'All existing pianos have been marked as Available.';
END $$;