# dbng
Datababse enging written in Node.js

## Installation
```bash
npm install dbng
```

## Usage
```typescript
import { Database, Table } from 'dbng';

const db = new Database('testDB', {
    users: new Table([
        { name: 'id', type: 'number', required: true, unique: true },
        { name: 'name', type: 'string', required: true },
        { name: 'age', type: 'number', required: true },
        { name: 'isCool', type: 'boolean', required: true },
        { name: 'createdAt', type: 'date', required: true },
        { name: 'metadata', type: 'json', required: true }
    ]),
    guilds: new Table([
        { name: 'id', type: 'number', required: true, unique: true },
        { name: 'name', type: 'string', required: true },
        { name: 'createdAt', type: 'date', required: true },
        { name: 'metadata', type: 'json', required: true }
    ])
});

const userRow = {
    id: { data: 1 },
    name: { data: 'John' },
    age: { data: 20 },
    isCool: { data: true },
    createdAt: { data: new Date() },
    metadata: {
        data: {
            favoriteColor: 'blue',
            favoriteNumber: 42
        }
    }
};

const guildRow = {
    id: { data: 1 },
    name: { data: 'My Server' },
    createdAt: { data: new Date() },
    metadata: {
        data: {
            owner: 'John',
            members: 20
        }
    }
};

db.getTable('users').insert(userRow);
db.getTable('guilds').insert(guildRow);

db.save();

const db2 = new Database('testDB', {
    users: new Table([
        { name: 'id', type: 'number', required: true, unique: true },
        { name: 'name', type: 'string', required: true },
        { name: 'age', type: 'number', required: true },
        { name: 'isCool', type: 'boolean', required: true },
        { name: 'createdAt', type: 'date', required: true },
        { name: 'metadata', type: 'json', required: true }
    ]),
    guilds: new Table([
        { name: 'id', type: 'number', required: true, unique: true },
        { name: 'name', type: 'string', required: true },
        { name: 'createdAt', type: 'date', required: true },
        { name: 'metadata', type: 'json', required: true }
    ])
});

db2.load();

console.log(db2.getTable('users').select());
console.log(db2.getTable('guilds').select());

db2.getTable('users').deleteWhere({ id: { data: 1 } });
db2.getTable('guilds').deleteWhere({ id: { data: 1 } });

db2.save();

console.log(db2.getTable('users').select());
console.log(db2.getTable('guilds').select());
```

## License
MIT
