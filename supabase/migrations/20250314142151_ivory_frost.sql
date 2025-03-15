/*
  # Add workspace sharing functionality

  1. New Tables
    - `workspace_members`
      - `workspace_id` (uuid, references workspaces)
      - `user_id` (uuid, references profiles)
      - `role` (text) - Member's role (viewer, editor)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on workspace_members table
    - Update workspace policies to allow access for members
    - Add policies for workspace_members management
*/

-- Create workspace_members table
CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('viewer', 'editor')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

-- Enable RLS
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Update workspace policies to include members
DROP POLICY IF EXISTS "Workspace owners have full access" ON workspaces;

-- Owners have full access
CREATE POLICY "Workspace owners have full access"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Members can view workspaces
CREATE POLICY "Members can view workspaces"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Members with editor role can update workspaces
CREATE POLICY "Editors can update workspaces"
  ON workspaces
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  );

-- Policies for workspace_members
CREATE POLICY "Workspace owners can manage members"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Members can view other members"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspace_id
      AND m.user_id = auth.uid()
    )
  );

-- Update sap_api_links policies to allow access for workspace members
DROP POLICY IF EXISTS "Users can manage their workspace API links" ON sap_api_links;

-- Owners have full access to API links
CREATE POLICY "Workspace owners can manage API links"
  ON sap_api_links
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

-- Members can view API links
CREATE POLICY "Members can view API links"
  ON sap_api_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = sap_api_links.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Editors can insert API links
CREATE POLICY "Editors can insert API links"
  ON sap_api_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  );

-- Editors can update API links
CREATE POLICY "Editors can update API links"
  ON sap_api_links
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  );

-- Editors can delete API links
CREATE POLICY "Editors can delete API links"
  ON sap_api_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  );