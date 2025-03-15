/*
  # Fix workspace access and member management

  1. Changes
    - Add email column to profiles query in workspace members
    - Fix workspace access policies
    - Update member management policies

  2. Security
    - Ensure proper access control for workspace members
    - Fix role-based permissions
*/

-- Add email to profiles selection for workspace members
CREATE POLICY "Members can view profiles of workspace members"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE (wm.user_id = profiles.id OR wm.user_id = auth.uid())
      AND EXISTS (
        SELECT 1 FROM workspace_members wm2
        WHERE wm2.workspace_id = wm.workspace_id
        AND wm2.user_id = auth.uid()
      )
    )
  );

-- Fix workspace access policies
DROP POLICY IF EXISTS "Members can view workspaces" ON workspaces;
CREATE POLICY "Members can view workspaces"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = owner_id
    OR EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Update workspace members policies
DROP POLICY IF EXISTS "Members can view other members" ON workspace_members;
CREATE POLICY "Members can view other members"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspace_members.workspace_id
      AND m.user_id = auth.uid()
    )
  );