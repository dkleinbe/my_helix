
/**
{
	"INIT": false,
	"VERSION": 5,
	"NAME": "V005",
	"COMMENT": "rename sessiont_types to session_types, add session_type to sessions"
}
**/

-- non-transactional
PRAGMA foreign_keys=OFF;

DROP TABLE sessiont_types;

CREATE TABLE IF NOT EXISTS "session_types" (
	"id" INTEGER NOT NULL UNIQUE,
	"label" TEXT NOT NULL,
	PRIMARY KEY("id")
);


DROP TABLE sessions;

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" INTEGER NOT NULL UNIQUE,
	"event" TEXT NOT NULL,
	"session_type" INTEGER NOT NULL,
	"status" TEXT NOT NULL,
	"payment" TEXT,
	PRIMARY KEY("id"),
	FOREIGN KEY ("session_type") REFERENCES "session_types"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- non-transactional
PRAGMA foreign_keys=ON;