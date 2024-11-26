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
        BMI FLOAT,
        BMR FLOAT,
        selected BOOLEAN DEFAULT FALSE
    );    
    
    CREATE TABLE cuisines (
        cuisine_id SERIAL PRIMARY KEY,
        cuisine_name VARCHAR(100) UNIQUE NOT NULL,
        selected BOOLEAN DEFAULT FALSE,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        chosen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    );

    CREATE TABLE graph_data (
        graph_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        time TIMESTAMP NOT NULL,
        weight FLOAT NOT NULL,
        BMI_achieved BOOLEAN NOT NULL,
        BMR_achieved BOOLEAN NOT NULL,
    );

    CREATE INDEX idx_users_mail ON users(mail);
