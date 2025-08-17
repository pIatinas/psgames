-- Clear all occupied slots to reset the system
UPDATE account_slots 
SET user_id = NULL, entered_at = NULL 
WHERE user_id IS NOT NULL;