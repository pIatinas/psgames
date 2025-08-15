-- Clear all account slots to make them free
UPDATE account_slots SET user_id = NULL, entered_at = NULL;