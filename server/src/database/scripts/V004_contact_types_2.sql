
/**
{
	"INIT": false,
	"VERSION": 4,
	"NAME": "V004",
	"COMMENT": "contact table refactor"
}
**/

-- non-transactional
PRAGMA foreign_keys=OFF;


CREATE TABLE IF NOT EXISTS "new_contacts" (
	"id" INTEGER,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"birthDate" TEXT NOT NULL,
	"sex" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"phone" TEXT NOT NULL,
	"address" TEXT NOT NULL,
	"city" TEXT NOT NULL,
	"job" TEXT,
	"type_bitfield" INTEGER NOT NULL,
	PRIMARY KEY("id")
);

INSERT INTO "new_contacts" (
    "id", 
    "firstName", "lastName", "birthDate", "sex", "email", "phone", "address", "city", "job", "type_bitfield") SELECT 
"id", 
"firstName", 
"lastName", 
"birthDate", 
"sex", 
"email", 
"phone", 
"address", 
"city", 
"job",
"type_id"
FROM "contacts" ; 

DROP TABLE contacts;

ALTER TABLE "new_contacts" RENAME TO "contacts";

-- non-transactional
PRAGMA foreign_keys=ON;