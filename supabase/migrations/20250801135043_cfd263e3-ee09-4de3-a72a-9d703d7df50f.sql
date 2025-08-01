-- Test linking game to account
INSERT INTO account_games (account_id, game_id)
SELECT a.id, g.id 
FROM accounts a, games g 
WHERE a.email = 'test@gamepass.com' 
AND g.name = 'God of War Ragnarök';