CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    age INTEGER NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
    bmi REAL,
    bmr REAL
);

CREATE TABLE MealCategories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL
);

CREATE TABLE Meals (
    meal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    meal_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES MealCategories(category_id)
);

CREATE TABLE UserMealPlans (
    plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    meal_id INTEGER,
    meal_time TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (meal_id) REFERENCES Meals(meal_id)
);

INSERT INTO MealCategories (category_name) VALUES ('Breakfast');
INSERT INTO MealCategories (category_name) VALUES ('Lunch');
INSERT INTO MealCategories (category_name) VALUES ('Dinner');
INSERT INTO MealCategories (category_name) VALUES ('Snack');
