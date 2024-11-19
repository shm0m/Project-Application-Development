    -- Création de la table des utilisateurs
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER CHECK (age > 0),
        height DECIMAL(5,2) CHECK (height > 0),
        weight DECIMAL(5,2) CHECK (weight > 0),
        gender VARCHAR(20),
        goal VARCHAR(50),
        mail VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;    

    -- Table pour les restrictions alimentaires
    CREATE TABLE dietary_restrictions (
        restriction_id SERIAL PRIMARY KEY,
        restriction_name VARCHAR(100) UNIQUE NOT NULL
    );

    -- Table de liaison entre utilisateurs et restrictions alimentaires
    CREATE TABLE user_dietary_restrictions (
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        restriction_id INTEGER REFERENCES dietary_restrictions(restriction_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, restriction_id)
    );

    -- Table pour les types de cuisine
    CREATE TABLE cuisines (
        cuisine_id SERIAL PRIMARY KEY,
        cuisine_name VARCHAR(100) UNIQUE NOT NULL
    );

    -- Table de liaison entre utilisateurs et cuisines préférées
    CREATE TABLE user_favorite_cuisines (
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        cuisine_id INTEGER REFERENCES cuisines(cuisine_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, cuisine_id)
    );

    -- Insertion de quelques restrictions alimentaires courantes
    INSERT INTO dietary_restrictions (restriction_name) VALUES
        ('Végétarien'),
        ('Végétalien'),
        ('Sans gluten'),
        ('Sans lactose'),
        ('Halal'),
        ('Casher'),
        ('Sans fruits de mer');

    -- Insertion de quelques types de cuisine
    INSERT INTO cuisines (cuisine_name) VALUES
        ('Française'),
        ('Italienne'),
        ('Japonaise'),
        ('Chinoise'),
        ('Mexicaine'),
        ('Indienne'),
        ('Méditerranéenne'),
        ('Thaïlandaise');

    -- Index pour améliorer les performances
    CREATE INDEX idx_users_mail ON users(mail);
    CREATE INDEX idx_user_restrictions ON user_dietary_restrictions(user_id);
    CREATE INDEX idx_user_cuisines ON user_favorite_cuisines(user_id);
