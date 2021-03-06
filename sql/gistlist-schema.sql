CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    profile_pic TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE lists(
    id SERIAL PRIMARY KEY,
    name VARCHAR(75) NOT NULL,
    description VARCHAR(255),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users ON DELETE CASCADE
);

CREATE TABLE list_items (
    id SERIAL PRIMARY KEY,
    item VARCHAR(255) NOT NULL,
    item_link TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    list_id INTEGER REFERENCES lists ON DELETE CASCADE
);