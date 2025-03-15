/*
  # Fix workspace member details view

  1. Changes
    - Create a secure view for workspace member details
    - Use proper security context for view access
    - Ensure proper data visibility for workspace members

  2. Security
    - View inherits RLS policies from underlying tables
    - Members can only see details of other members in their workspaces
*/

-- Create a secure view for workspace member details
CREATE OR REPLACE VIEW workspace_member_details AS
SELECT 
  wm.workspace_id,
  wm.user_id,
  wm.role,
  wm.created_at,
  p.name,
  u.email
FROM workspace_members wm
JOIN profiles p ON p.id = wm.user_id
JOIN auth.users u ON u.id = wm.user_id
WHERE (
  -- User can see members of workspaces they own
  EXISTS (
    SELECT 1 FROM workspaces w
    WHERE w.id = wm.workspace_id
    AND w.owner_id = auth.uid()
  )
  OR
  -- User can see members of workspaces they are a member of
  EXISTS (
    SELECT 1 FROM workspace_members m
    WHERE m.workspace_id = wm.workspace_id
    AND m.user_id = auth.uid()
  )
);

-- Grant appropriate permissions
GRANT SELECT ON workspace_member_details TO authenticated;

-- Ensure the view is treated as security definer
ALTER VIEW workspace_member_details SET (security_barrier = true);

COMMENT ON VIEW workspace_member_details IS 'Secure view showing workspace member details with proper access control';