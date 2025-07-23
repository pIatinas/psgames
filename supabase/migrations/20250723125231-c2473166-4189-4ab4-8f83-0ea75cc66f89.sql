
-- Inserir jogos de teste
INSERT INTO games (name, image, banner, platform, description, developer, genre, release_date) VALUES
('God of War Ragnarök', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1920&h=500&fit=crop', ARRAY['PS5'], 'Kratos e Atreus embarcam em uma jornada mítica', 'Santa Monica Studio', 'Ação/Aventura', '2022-11-09'),
('Horizon Forbidden West', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&h=500&fit=crop', ARRAY['PS5', 'PS4'], 'Aloy explora terras proibidas', 'Guerrilla Games', 'RPG/Ação', '2022-02-18'),
('Marvel''s Spider-Man 2', 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?q=80&w=1920&h=500&fit=crop', ARRAY['PS5'], 'Peter Parker e Miles Morales enfrentam novos desafios', 'Insomniac Games', 'Ação/Aventura', '2023-10-20'),
('Final Fantasy XVI', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&h=500&fit=crop', ARRAY['PS5'], 'Uma história épica de fantasia', 'Square Enix', 'RPG', '2023-06-22'),
('Ratchet & Clank: Rift Apart', 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1920&h=500&fit=crop', ARRAY['PS5'], 'Aventura interdimensional', 'Insomniac Games', 'Plataforma/Ação', '2021-06-11'),
('Demon''s Souls', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&h=500&fit=crop', ARRAY['PS5'], 'Remake do clássico souls-like', 'Bluepoint Games', 'RPG/Ação', '2020-11-12'),
('Returnal', 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=1920&h=500&fit=crop', ARRAY['PS5'], 'Roguelike sci-fi', 'Housemarque', 'Ação/Roguelike', '2021-04-30'),
('Gran Turismo 7', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1920&h=500&fit=crop', ARRAY['PS5', 'PS4'], 'Simulador de corrida definitivo', 'Polyphony Digital', 'Corrida/Simulação', '2022-03-04'),
('Uncharted 4', 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=1920&h=500&fit=crop', ARRAY['PS4', 'PS5'], 'Última aventura de Nathan Drake', 'Naughty Dog', 'Ação/Aventura', '2016-05-10'),
('The Last of Us Part I', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&h=500&fit=crop', ARRAY['PS3', 'PS4', 'PS5'], 'Sobrevivência pós-apocalíptica', 'Naughty Dog', 'Ação/Sobrevivência', '2013-06-14'),
('Persona 4 Golden', 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=300&h=400&fit=crop', 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1920&h=500&fit=crop', ARRAY['VITA', 'PS4'], 'JRPG com elementos de mistério', 'Atlus', 'JRPG', '2012-06-14');

-- Inserir contas de teste
INSERT INTO accounts (email, password, codes, qr_code, birthday, security_answer) VALUES
('psngames_principal@example.com', 'senha123', 'ABC123', 'https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop', '1990-01-15', 'Resposta de segurança 1'),
('psngames_exclusivos@example.com', 'senha456', 'DEF456', 'https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop', '1985-03-20', 'Resposta de segurança 2'),
('psngames_multi@example.com', 'senha789', 'GHI789', 'https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop', '1992-07-10', 'Resposta de segurança 3'),
('psngames_indie@example.com', 'senhaABC', 'JKL012', 'https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop', '1988-12-05', 'Resposta de segurança 4'),
('psngames_rpg@example.com', 'senhaDEF', 'MNO345', 'https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop', '1995-09-18', 'Resposta de segurança 5'),
('psngames_aventura@example.com', 'senhaGHI', 'PQR678', 'https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop', '1987-11-30', 'Resposta de segurança 6');

-- Vincular jogos às contas
INSERT INTO account_games (account_id, game_id)
SELECT a.id, g.id FROM accounts a, games g 
WHERE a.email = 'psngames_principal@example.com' AND g.name IN ('God of War Ragnarök', 'Horizon Forbidden West', 'Marvel''s Spider-Man 2');

INSERT INTO account_games (account_id, game_id)
SELECT a.id, g.id FROM accounts a, games g 
WHERE a.email = 'psngames_exclusivos@example.com' AND g.name IN ('Final Fantasy XVI', 'Ratchet & Clank: Rift Apart', 'Demon''s Souls');

INSERT INTO account_games (account_id, game_id)
SELECT a.id, g.id FROM accounts a, games g 
WHERE a.email = 'psngames_multi@example.com' AND g.name IN ('Returnal', 'Gran Turismo 7', 'Uncharted 4', 'The Last of Us Part I');

INSERT INTO account_games (account_id, game_id)
SELECT a.id, g.id FROM accounts a, games g 
WHERE a.email = 'psngames_indie@example.com' AND g.name IN ('God of War Ragnarök', 'Gran Turismo 7', 'Persona 4 Golden');

INSERT INTO account_games (account_id, game_id)
SELECT a.id, g.id FROM accounts a, games g 
WHERE a.email = 'psngames_rpg@example.com' AND g.name IN ('Marvel''s Spider-Man 2', 'Final Fantasy XVI', 'Ratchet & Clank: Rift Apart', 'Persona 4 Golden');

INSERT INTO account_games (account_id, game_id)
SELECT a.id, g.id FROM accounts a, games g 
WHERE a.email = 'psngames_aventura@example.com' AND g.name IN ('Horizon Forbidden West', 'Demon''s Souls', 'Returnal', 'Uncharted 4', 'The Last of Us Part I');

-- Inserir alguns perfis de teste (além do admin)
INSERT INTO profiles (id, name, avatar_url, role) VALUES
(gen_random_uuid(), 'João Silva', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&fit=crop', 'member'),
(gen_random_uuid(), 'Maria Oliveira', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop', 'member'),
(gen_random_uuid(), 'Pedro Santos', 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&h=100&fit=crop', 'member'),
(gen_random_uuid(), 'Ana Costa', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&fit=crop', 'member');

-- Adicionar alguns slots ocupados para teste
INSERT INTO account_slots (account_id, slot_number, user_id, entered_at)
SELECT a.id, 1, p.id, now() - interval '1 hour'
FROM accounts a, profiles p
WHERE a.email = 'psngames_principal@example.com' AND p.name = 'João Silva' AND p.role = 'member';

INSERT INTO account_slots (account_id, slot_number, user_id, entered_at)
SELECT a.id, 2, p.id, now() - interval '30 minutes'
FROM accounts a, profiles p
WHERE a.email = 'psngames_exclusivos@example.com' AND p.name = 'Maria Oliveira' AND p.role = 'member';

INSERT INTO account_slots (account_id, slot_number, user_id, entered_at)
SELECT a.id, 1, p.id, now() - interval '2 hours'
FROM accounts a, profiles p
WHERE a.email = 'psngames_multi@example.com' AND p.name = 'Pedro Santos' AND p.role = 'member';
