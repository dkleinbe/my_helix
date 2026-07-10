

CREATE TABLE IF NOT EXISTS
    patients (
        id VARCHAR(8) PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        lastName VARCHAR(80) NOT NULL,
        birthDate VARCHAR(16) NOT NULL,
        sex VARCHAR(1) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address VARCHAR(160) NOT NULL,
        city VARCHAR(80) NOT NULL,
        job VARCHAR(80) NOT NULL,
        doctor VARCHAR(80),
        passif JSON NOT NULL
    );

CREATE TABLE IF NOT EXISTS
    users (
        uid VARCHAR(8) PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        lastName VARCHAR(80) NOT NULL,
        role VARCHAR(12) NOT NULL,
        state VARCHAR(16) NOT NULL,
        password TEXT NOT NULL,
        refreshToken TEXT,
        lastActive VARCHAR(20) NOT NULL     
    );

CREATE TABLE IF NOT EXISTS
    events (
        id VARCHAR(8) PRIMARY KEY,
        calendar VARCHAR(8) NOT NULL,
        title VARCHAR(80) NOT NULL,
        start VARCHAR(16) NOT NULL,
        end VARCHAR(16) NOT NULL,
        appID VARCHAR(8),
        FOREIGN KEY (calendar) REFERENCES users(uid) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    appointments (
        id VARCHAR(8) PRIMARY KEY,
        patientId VARCHAR(8) NOT NULL,
        event VARCHAR(8) NOT NULL,
        kind VARCHAR(16) NOT NULL,
        content JSON NOT NULL,
        status VARCHAR(10) NOT NULL,
        payment VARCHAR(8),
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    accounting (
        uid VARCHAR(8) PRIMARY KEY,
        amount INT NOT NULL,
        method VARCHAR(10) NOT NULL,
        date VARCHAR(16) NOT NULL,
        appointment VARCHAR(8),
        facture INT AUTO_INCREMENT,
        FOREIGN KEY (appointment) REFERENCES appointments(id) ON DELETE
        SET NULL
    );
