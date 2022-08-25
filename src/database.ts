import fs from 'fs';
import path from 'path';

import { Table, Column } from './table';

export class Database<Tables extends { [key: string]: Table<Column[]> }> {
    name: string;

    private tables: Tables;
    private dbFolder: string;

    constructor(name: string, tables: Tables, dbFolder?: string) {
        this.name = name;
        this.tables = tables;
        if (dbFolder) this.dbFolder = dbFolder;
        else this.dbFolder = path.join(process.cwd(), 'db', this.name);
        if (!fs.existsSync(this.dbFolder)) fs.mkdirSync(this.dbFolder, { recursive: true });
    }

    public getTable<Name extends keyof Tables>(name: Name): Tables[Name] {
        return this.tables[name];
    }

    public getTables(): Tables {
        return this.tables;
    }

    public getTableNames(): (keyof Tables)[] {
        return Object.keys(this.tables) as (keyof Tables)[];
    }

    public save() {
        for (const [tablename, table] of Object.entries(this.tables)) {
            fs.writeFileSync(path.join(this.dbFolder, `${tablename}.ndb`), table.exportAsBinary());
        }
    }

    public load() {
        for (const [tablename, table] of Object.entries(this.tables)) {
            const tableFile = path.join(this.dbFolder, `${tablename}.ndb`);
            if (fs.existsSync(tableFile)) {
                table.importFromBinary(fs.readFileSync(tableFile));
            }
        }
    }
}
