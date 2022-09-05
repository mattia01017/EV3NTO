CREATE TABLE users (
    email VARCHAR PRIMARY KEY,
    username VARCHAR NOT NULL,
    pwd CHAR(66) NOT NULL
);

CREATE TABLE events (
    id CHAR(10) PRIMARY KEY,
    title VARCHAR NOT NULL,
    ddate TIMESTAMP NOT NULL,
    num_part INTEGER DEFAULT 0,
    max_num_part INTEGER,
    descr TEXT,
    priv BOOLEAN NOT NULL,
    img VARCHAR,
    organizer VARCHAR NOT NULL REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE
    location_name VARCHAR NOT NULL
    loc_lat FLOAT
    loc_lon FLOAT
    CHECK (num_part <= max_num_part)
);

CREATE TABLE partecipations (
    p_id SERIAL PRIMARY KEY
    user_email VARCHAR REFERENCES users(email) ON DELETE SET NULL ON UPDATE CASCADE,
    p_event CHAR(10) REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE
);