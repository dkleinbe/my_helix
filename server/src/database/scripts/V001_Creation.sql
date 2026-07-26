/**
{
	"INIT": true,
	"VERSION": 1,
	"NAME": "V001",
	"COMMENT": "Creation version 1"
}
**/
-- non-transactional
PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS "link-types" (
	"id" INTEGER NOT NULL UNIQUE,
	"label" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "sessiont_types" (
	"id" INTEGER NOT NULL UNIQUE,
	"label" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" INTEGER NOT NULL UNIQUE,
	"label" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "user_states" (
	"id" INTEGER NOT NULL UNIQUE,
	"label" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "contacts" (
	"id" INTEGER,
	"name" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"birthDate" TEXT NOT NULL,
	"sex" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"phone" TEXT NOT NULL,
	"address" TEXT NOT NULL,
	"city" TEXT NOT NULL,
	"job" TEXT,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" INTEGER NOT NULL UNIQUE,
	"login" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"role" INTEGER NOT NULL,
	"state" INTEGER NOT NULL,
	"refreshToken" TEXT,
	"lastActive" TEXT NOT NULL,
	"contact_id" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("contact_id") REFERENCES "contacts"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("role") REFERENCES "user_roles"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("state") REFERENCES "user_states"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" INTEGER NOT NULL UNIQUE,
	"event" TEXT NOT NULL,
	"kind" TEXT NOT NULL,
	"status" TEXT NOT NULL,
	"payment" TEXT,
	PRIMARY KEY("id"),
	FOREIGN KEY ("id") REFERENCES "sessiont_types"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);


CREATE TABLE IF NOT EXISTS "contact_links" (
	"id_1" INTEGER,
	"id_2" INTEGER,
	"type_id" INTEGER,
	PRIMARY KEY("id_1", "id_2"),
	FOREIGN KEY ("id_1") REFERENCES "contacts"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("id_2") REFERENCES "contacts"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("type_id") REFERENCES "link-types"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "session_participants" (
	"session_id" INTEGER NOT NULL,
	"participant_id" INTEGER NOT NULL,
	PRIMARY KEY("session_id", "participant_id"),
	FOREIGN KEY ("session_id") REFERENCES "sessions"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("participant_id") REFERENCES "contacts"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);



CREATE TABLE IF NOT EXISTS "client_data" (
	"id" INTEGER NOT NULL UNIQUE,
	"contact_id" INTEGER NOT NULL,
	"history" TEXT,
	PRIMARY KEY("id"),
	FOREIGN KEY ("contact_id") REFERENCES "contacts"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- non-transactional
PRAGMA foreign_keys=OFF;

INSERT INTO user_roles(label) VALUES ('admin');

INSERT INTO user_states(label) VALUES ('enabled');

INSERT INTO
    users(
        id,
        login,
        password,
		role,
        state,
        lastActive
    )
VALUES (
        1,
        'admin',
        '$2b$10$69H/ENdNSVaXZL6sZmvBwe/fXFgbB6tMxqP6zbJKLVGhoClFAJ6Oq',
		1,
		1,
        'first-time'
    );

