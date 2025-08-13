-- Add admin role to existing admin user and remove password column from accounts if it exists
-- First, check if wallace_erick@hotmail.com has admin role, if not, add it
INSERT INTO user_roles (user_id, role)
SELECT p.id, 'admin'::app_role
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'wallace_erick@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = p.id AND ur.role = 'admin'
);

-- Update profiles to set role as admin for wallace_erick@hotmail.com
UPDATE profiles 
SET role = 'admin'
WHERE id IN (
  SELECT p.id 
  FROM profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE au.email = 'wallace_erick@hotmail.com'
);

-- Remove password column from accounts table as it's not needed
ALTER TABLE accounts DROP COLUMN IF EXISTS password;