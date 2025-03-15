/*
  # Add API URL to artifacts table

  1. Changes
    - Add `api_url` column to artifacts table
    - Make it nullable to support existing records
    - Add index for better query performance

  2. Notes
    - Existing artifacts will have NULL api_url
    - Future artifacts will store the URL for refresh functionality
*/

-- Add api_url column to artifacts table
ALTER TABLE artifacts
ADD COLUMN api_url text;

-- Add index for better performance when querying by api_url
CREATE INDEX idx_artifacts_api_url ON artifacts(api_url);