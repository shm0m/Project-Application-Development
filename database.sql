CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    height DECIMAL(5, 2) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    activity_level VARCHAR(50),
    goal VARCHAR(50)
);

CREATE TABLE MealCategories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE Meals (
    meal_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES MealCategories(category_id),
    meal_name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fats DECIMAL(5, 2)
);

CREATE TABLE UserMealPlans (
    plan_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    breakfast_id INT REFERENCES Meals(meal_id),
    lunch_id INT REFERENCES Meals(meal_id),
    dinner_id INT REFERENCES Meals(meal_id),
    snack_id INT REFERENCES Meals(meal_id),
    total_calories INT NOT NULL,
    date DATE NOT NULL
);

INSERT INTO MealCategories (category_name) VALUES
('Breakfast'),
('Lunch'),
('Dinner'),
('Snack');
