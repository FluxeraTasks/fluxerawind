/*
  # Add SAP API Links table

  1. New Tables
    - `sap_api_links`
      - `id` (uuid, primary key)
      - `workspace_id` (uuid, references workspaces)
      - `name` (text) - Display name for the API
      - `url` (text) - The API endpoint URL
      - `description` (text) - Optional description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `sap_api_links` table
    - Add policies for workspace owners
*/

CREATE TABLE IF NOT EXISTS sap_api_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sap_api_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their workspace API links"
  ON sap_api_links
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = sap_api_links.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = sap_api_links.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_sap_api_links_updated_at
  BEFORE UPDATE ON sap_api_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();