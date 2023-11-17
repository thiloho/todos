CREATE TABLE auth_user (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    auth_provider TEXT NOT NULL
);

CREATE TABLE user_key (
    id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    hashed_password TEXT
);

CREATE TABLE user_session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL
);

CREATE TABLE todo_category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color_light CHAR(7),
    color_dark CHAR(7)
);

INSERT INTO todo_category (name, color_light, color_dark) VALUES
    ('Blue Category', '#1e3a8a', '#60a5fa'),
    ('Red Category', '#7f1d1d', '#fb7185'),
    ('Yellow Category', '#78350f', '#fdba74'),
    ('Green Category', '#14532d', '#4ade80'),
    ('Purple Category', '#4c1d95', '#c084fc'),
    ('Orange Category', '#7c2d12', '#fb923c'),
    ('Pink Category', '#831843', '#f472b6'),
    ('Gray Category', '#1f2937', '#94a3b8');

CREATE TABLE user_todo (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    title varchar(255) NOT NULL,
    is_completed boolean NOT NULL DEFAULT false,
    is_important boolean NOT NULL DEFAULT false,
    due_date timestamp with time zone,
    is_overdue boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    category_id INT,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES todo_category(id)
);

CREATE TABLE user_todo_organization (
    user_id text NOT NULL PRIMARY KEY,
    filter text NOT NULL DEFAULT 'all',
    sort_by text NOT NULL DEFAULT 'creation-date',
    is_grouped boolean NOT NULL DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);