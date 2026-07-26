
/**
{
	"INIT": false,
	"VERSION": 3,
	"NAME": "V003",
	"COMMENT": "add contact_types table"
}
**/
PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS "contact_types" (
	"id" INTEGER NOT NULL,
	"label" TEXT NOT NULL,
	PRIMARY KEY("id")
);

INSERT INTO contact_types ("id", "label") VALUES (0, 'TBD');

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
	"type_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("type_id") REFERENCES "contact_types"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO "new_contacts" (
    "id", 
    "firstName", "lastName", "birthDate", "sex", "email", "phone", "address", "city", "job", "type_id") SELECT 
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
0
FROM "contacts" ; 

DROP TABLE contacts;

ALTER TABLE "new_contacts" RENAME TO "contacts";


PRAGMA foreign_keys=ON;