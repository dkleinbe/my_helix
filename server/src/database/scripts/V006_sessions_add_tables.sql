
/**
{
	"INIT": false,
	"VERSION": 6,
	"NAME": "V006",
	"COMMENT": "add participant_roles, session_modes, refactor session_types, sessions"
}
**/

-- non-transactional
PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS "participant_roles" (
	"id" INTEGER NOT NULL,
	"label" TEXT,
	PRIMARY KEY("id")
);

INSERT INTO participant_roles VALUES(1,'Client');
INSERT INTO participant_roles VALUES(2,'Praticien');
INSERT INTO participant_roles VALUES(3,'Autre');

CREATE TABLE IF NOT EXISTS "session_modes" (
	"id" INTEGER NOT NULL,
	-- Téléphone, Visio, Cabinet, Domicile
	"label" TEXT,
	PRIMARY KEY("id")
);

INSERT INTO session_modes VALUES(1,'Téléphone');
INSERT INTO session_modes VALUES(2,'Viso');
INSERT INTO session_modes VALUES(3,'Cabinet');
INSERT INTO session_modes VALUES(4,'Domicile');


DROP TABLE session_types;

CREATE TABLE IF NOT EXISTS "session_types" (
	"id" INTEGER NOT NULL UNIQUE,
	-- Contact téléphonique, Premier RDV, Suivi, Urgence  
	"label" TEXT NOT NULL,
	PRIMARY KEY("id")
);

INSERT INTO session_types VALUES(1,'Contact téléphonique');
INSERT INTO session_types VALUES(2,'Premier RDV');
INSERT INTO session_types VALUES(3,'Suivi');
INSERT INTO session_types VALUES(4,'Urgence');

DROP TABLE sessions;

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" INTEGER NOT NULL UNIQUE,
	"event" TEXT NOT NULL,
	"session_type" INTEGER NOT NULL,
	"status" TEXT NOT NULL,
	"payment" TEXT,
	-- Note de séance
	"notes" TEXT,
	"mode" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("session_type") REFERENCES "session_types"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("mode") REFERENCES "session_modes"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- non-transactional
PRAGMA foreign_keys=ON;