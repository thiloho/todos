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

CREATE TABLE user_todo (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL,
    title varchar(255) NOT NULL,
    is_completed boolean NOT NULL DEFAULT false,
    is_important boolean NOT NULL DEFAULT false,
    due_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE TABLE user_todo_organization (
    user_id text NOT NULL PRIMARY KEY,
    filter text NOT NULL DEFAULT 'all',
    sort_by text NOT NULL DEFAULT 'creation-date',
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);