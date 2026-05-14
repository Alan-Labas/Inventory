USE db_inventory;

-- Najprej počistimo stare testne podatke, da ne bo napak zaradi podvojenih unikatnih ključev
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ingredient;
TRUNCATE TABLE recipe;
TRUNCATE TABLE inventoryItem;
TRUNCATE TABLE shoppingList;
TRUNCATE TABLE item;
TRUNCATE TABLE category;
TRUNCATE TABLE storageLocation;
TRUNCATE TABLE pet;
TRUNCATE TABLE user;
TRUNCATE TABLE unit;
TRUNCATE TABLE houseHold;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. GOSPODINJSTVO
INSERT INTO houseHold (name, inviteCode) VALUES ('Alanov Dom', 'ALAN-INVITE-2026');

-- 2. ENOTE
INSERT INTO unit (name, abbreviation) VALUES
                                          ('Kilogram', 'kg'), ('Liter', 'l'), ('Kos', 'kos'), ('Gram', 'g'), ('Pločevinka', 'ploč.');

-- 3. UPORABNIKI
INSERT INTO user (name, surname, email, passwordHash, username, role, isActive, household_id)
VALUES ('Alan', 'Labaš', 'alan@test.si', '$2a$10$hash', 'alanlabas', 'ADMIN', 1, 1);

-- 4. KATEGORIJE (Dodane nove za Chilli)
INSERT INTO category (name, icon, household_id) VALUES
                                                    ('Meso', 'meat-icon', 1),
                                                    ('Zelenjava', 'carrot-icon', 1),
                                                    ('Konzerve', 'can-icon', 1),
                                                    ('Začimbe', 'spice-icon', 1);

-- 5. LOKACIJE
INSERT INTO storageLocation (name, type, household_id) VALUES
                                                           ('Hladilnik', 'Fridge', 1),
                                                           ('Shramba', 'Pantry', 1);

-- 6. RECEPT: Chilli con Carne
INSERT INTO recipe (name, description, prepTime, household_id)
VALUES ('Chilli con Carne', 'Pikantna enolončnica z mletim mesom, fižolom in koruzo.', 45, 1);

-- 7. ARTIKLI (Vsi potrebni za Chilli)
INSERT INTO item (name, barcode, household_id, category_id, pet_id) VALUES
                                                                        ('Mleto goveje meso', '383001', 1, 1, NULL),
                                                                        ('Čebula', '383002', 1, 2, NULL),
                                                                        ('Rdeči fižol', '383003', 1, 3, NULL),
                                                                        ('Koruza', '383004', 1, 3, NULL),
                                                                        ('Paradižnik v koščkih', '383005', 1, 3, NULL),
                                                                        ('Chilli v prahu', '383006', 1, 4, NULL);

-- 8. SESTAVINE ZA CHILLI (Povezava recepta in artiklov)
-- Predvidevamo: recipe_id = 1 (Chilli), item_id-ji si sledijo od 1 do 6
INSERT INTO ingredient (amount, recipe_id, item_id) VALUES
                                                        (500.00, 1, 1), -- 500g mesa
                                                        (2.00, 1, 2),   -- 2 čebuli
                                                        (1.00, 1, 3),   -- 1 pločevinka fižola
                                                        (1.00, 1, 4),   -- 1 pločevinka koruze
                                                        (1.00, 1, 5),   -- 1 paradižnik (konzerva)
                                                        (10.00, 1, 6);  -- 10g chillija

-- 9. DODAJMO ŠE NEKAJ V ZALOGO (Da lahko preveriš, če imaš sestavine)
INSERT INTO inventoryItem (quantity, expiryDate, item_id, location_id, unit_id) VALUES
                                                                                    (1000.00, '2026-05-20', 1, 1, 4), -- Imamo 1kg mesa v hladilniku
                                                                                    (5.00, '2026-06-15', 2, 2, 3),    -- Imamo 5 čebul v shrambi
                                                                                    (0.00, '2027-01-01', 3, 2, 5);    -- Fižola nimamo (0 pločevink)