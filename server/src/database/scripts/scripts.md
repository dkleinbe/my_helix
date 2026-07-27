# Migration script syntax

## Header

Header must respect strictly the following syntax

```json
/**
{
	"INIT": true,
	"VERSION": 1,
	"NAME": "V001",
	"COMMENT": "Creation version 1"
}
**/
```

`INIT` : if `true` this is a full creation of the database, if `false` only an update  
`VERSION` : database version, must be unique, if the current version is >= the migration will not be applied  
`NAME` : name of the migration, only for information, but required  
`COMMENT` : description of the migration, required

## Content

### SQL statements  

**Each** non transactionnal statement must be preceded by:  

`-- non-transactional`

ex: 

```sql
-- non-transactional
PRAGMA foreign_keys=OFF;
```

Every following other statements until the next `non-transactional` directive are run in a transaction

