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
    ('Blue category', '#1d4ed8', '#60a5fa'),
    ('Red category', '#b91c1c', '#fb7185'),
    ('Yellow category', '#a16207', '#fdba74'),
    ('Green category', '#15803d', '#4ade80'),
    ('Purple category', '#7e22ce', '#c084fc'),
    ('Orange category', '#c2410c', '#fb923c'),
    ('Pink category', '#be185d', '#f472b6'),
    ('Gray category', '#374151', '#94a3b8');

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
    search_term text NOT NULL DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);