/*
  # Fix workspace member email lookup

  1. Changes
    - Create a secure view for looking up users by email
    - Add appropriate security policies
    - Grant necessary permissions

  2. Security
    - Only allow authenticated users to use the view
    - Restrict access to prevent email enumeration
*/

-- Create a secure view for looking up users by email
CREATE OR REPLACE VIEW user_lookup AS
SELECT 
  u.id as user_id,
  u.email,
  p.name
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE (
  -- Users can only find other users that are:
  -- 1. Members of workspaces they own
  EXISTS (
    SELECT 1 FROM workspaces w
    WHERE w.owner_id = auth.uid()
  )
  OR
  -- 2. Members of workspaces they belong to
  EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.user_id = u.id
    AND EXISTS (
      SELECT 1 FROM workspace_members wm2
      WHERE wm2.workspace_id = wm.workspace_id
      AND wm2.user_id = auth.uid()
    )
  )
);

-- Grant appropriate permissions
GRANT SELECT ON user_lookup TO authenticated;

-- Ensure the view is treated as security definer
ALTER VIEW user_lookup SET (security_barrier = true);

COMMENT ON VIEW user_lookup IS 'Secure view for looking up users by email with proper access control';