-- Test inserting a new game
INSERT INTO games (name, platform, description, developer, genre, release_date)
VALUES ('God of War Ragnarök', ARRAY['PS5', 'PS4'], 'Continuação épica da saga de Kratos e Atreus', 'Santa Monica Studio', 'Action/Adventure', '2022-11-09');

-- Test inserting a new account
INSERT INTO accounts (email, password, birthday)
VALUES ('test@gamepass.com', 'senhaSecreta123', '1990-01-01');

-- Get the account ID for slot creation
INSERT INTO account_slots (account_id, slot_number)
SELECT id, 1 FROM accounts WHERE email = 'test@gamepass.com'
UNION ALL
SELECT id, 2 FROM accounts WHERE email = 'test@gamepass.com';