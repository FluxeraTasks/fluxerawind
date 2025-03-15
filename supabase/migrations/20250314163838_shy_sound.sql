/*
  # Add technical name to artifacts table

  1. Changes
    - Add `technical_name` column to artifacts table as nullable first
    - Set default values for existing records
    - Make the column required
    - Add index for better query performance

  2. Notes
    - Handle existing records by setting a default technical name based on the artifact name
    - Ensure no data loss during migration
*/

-- First add the column as nullable
ALTER TABLE artifacts
ADD COLUMN technical_name text;

-- Update existing records with a default value based on the name
UPDATE artifacts
SET technical_name = UPPER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '_'))
WHERE technical_name IS NULL;

-- Now make the column required
ALTER TABLE artifacts
ALTER COLUMN technical_name SET NOT NULL;

-- Add index for better performance
CREATE INDEX idx_artifacts_technical_name ON artifacts(technical_name);