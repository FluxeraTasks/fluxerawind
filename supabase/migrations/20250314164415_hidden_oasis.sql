/*
  # Add documentation column to artifacts table

  1. Changes
    - Add documentation column to store generated documentation text
    - Make it nullable since not all artifacts will have documentation initially

  2. Security
    - No changes to security policies needed as existing policies cover the new column
*/

-- Add documentation column to artifacts table
ALTER TABLE artifacts
ADD COLUMN documentation text;