DROP DATABASE IF EXISTS db_inventory;
CREATE DATABASE db_inventory;
use db_inventory;

CREATE TABLE IF NOT EXISTS houseHold (
    householdID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    inviteCode VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS unit (
    unitID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    abbreviation VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS user (
    userID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(45) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN NOT NULL,
    household_id BIGINT NOT NULL,
    CONSTRAINT fk_user_household FOREIGN KEY (household_id) REFERENCES houseHold(householdID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pet (
    petID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    species VARCHAR(45) NOT NULL,
    breed VARCHAR(45) NOT NULL,
    dailyConsumption DECIMAL(10,2) NOT NULL,
    household_id BIGINT NOT NULL,
    CONSTRAINT fk_pet_household FOREIGN KEY (household_id) REFERENCES houseHold(householdID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category (
    categoryID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    household_id BIGINT NOT NULL,
    CONSTRAINT fk_category_household FOREIGN KEY (household_id) REFERENCES houseHold(householdID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS storageLocation (
    storageLocationID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    type VARCHAR(45) NOT NULL,
    household_id BIGINT NOT NULL,
    CONSTRAINT fk_storageLocation_household FOREIGN KEY (household_id) REFERENCES houseHold(householdID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe (
    recipeID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    description TEXT NOT NULL,
    prepTime INT NOT NULL,
    household_id BIGINT NOT NULL,
    CONSTRAINT fk_recipe_household FOREIGN KEY (household_id) REFERENCES houseHold(householdID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item (
    itemID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(225) NOT NULL,
    barcode VARCHAR(225) NOT NULL,
    household_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    pet_id BIGINT,
    CONSTRAINT fk_item_household FOREIGN KEY (household_id) REFERENCES houseHold(householdID) ON DELETE CASCADE,
    CONSTRAINT fk_item_category FOREIGN KEY (category_id) REFERENCES category(categoryID),
    CONSTRAINT fk_item_pet FOREIGN KEY (pet_id) REFERENCES pet(petID)
);

CREATE TABLE IF NOT EXISTS notification (
    notificationID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(45) NOT NULL,
    isRead BOOLEAN NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES user(userID)
);

CREATE TABLE IF NOT EXISTS shoppingList(
    shoppingListID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    quantity DECIMAL(10,2) NOT NULL,
    isBought BOOLEAN NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    item_id BIGINT NOT NULL,
    household_id BIGINT NOT NULL,
    CONSTRAINT fk_shoppingList_household FOREIGN KEY (household_id) REFERENCES houseHold(householdID) ON DELETE CASCADE,
    CONSTRAINT fk_shoppingList_item FOREIGN KEY (item_id) REFERENCES item(itemID)
);

CREATE TABLE IF NOT EXISTS ingredient (
    ingredientID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2),
    recipe_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    CONSTRAINT fk_ingredient_recipe FOREIGN KEY (recipe_id) REFERENCES recipe(recipeID),
    CONSTRAINT fk_ingredient_item FOREIGN KEY (item_id) REFERENCES item(itemID)
);

CREATE TABLE IF NOT EXISTS inventoryItem (
    inventoryItemID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    quantity DECIMAL(10,2) NOT NULL,
    expiryDate DATE NOT NULL,
    addedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    item_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    unit_id BIGINT NOT NULL,
    CONSTRAINT fk_inventoryItem_item FOREIGN KEY (item_id) REFERENCES item(itemID),
    CONSTRAINT fk_inventoryItem_location FOREIGN KEY (location_id) REFERENCES storageLocation(storageLocationID),
    CONSTRAINT fk_inventoryItem_unit FOREIGN KEY (unit_id) REFERENCES unit(unitID)
);

CREATE INDEX idx_item_barcode ON item(barcode);
CREATE INDEX idx_inventory_expiry ON inventoryItem(expiryDate);
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_username ON user(username);
CREATE INDEX idx_item_household ON item(household_id);
CREATE INDEX idx_inventory_household ON inventoryItem(location_id);
CREATE INDEX idx_shopping_household ON shoppingList(household_id);
CREATE INDEX idx_notification_user_unread ON notification(user_id, isRead);
CREATE INDEX idx_notification_user ON notification(user_id);
CREATE INDEX idx_shopping_list_item ON shoppingList(item_id);