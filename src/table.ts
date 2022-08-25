import crypto from 'crypto';
import v8 from 'v8';

export type JSONResolvable = string | number | boolean | Date | JSONResolvable[] | { [key: string]: JSONResolvable };

export type RawStringColumn = {
    name: string;
    type: 'string';
    datatype: string;
    default?: string;
    required?: boolean;
    unique?: boolean;
};

export type StringColumn = Omit<RawStringColumn, 'datatype'>;

export type RawNumberColumn = {
    name: string;
    type: 'number';
    datatype: number;
    default?: number;
    required?: boolean;
    unique?: boolean;
};

export type NumberColumn = Omit<RawNumberColumn, 'datatype'>;

export type RawBooleanColumn = {
    name: string;
    type: 'boolean';
    datatype: boolean;
    default?: boolean;
    required?: boolean;
    unique?: boolean;
};

export type BooleanColumn = Omit<RawBooleanColumn, 'datatype'>;

export type RawDateColumn = {
    name: string;
    type: 'date';
    datatype: Date;
    default?: Date;
    required?: boolean;
    unique?: boolean;
};

export type DateColumn = Omit<RawDateColumn, 'datatype'>;

export type RawJSONColumn = {
    name: string;
    type: 'json';
    datatype: JSONResolvable;
    default?: JSONResolvable;
    required?: boolean;
    unique?: boolean;
};

export type JSONColumn = Omit<RawJSONColumn, 'datatype'>;

export type Column =
    StringColumn |
    NumberColumn |
    BooleanColumn |
    DateColumn |
    JSONColumn;

export class Table<Columns extends Column[]> {
    private columns: Columns;
    private rows: {
        id: string;
        data: {
            [key: string]: JSONResolvable;
        }
    }[];

    constructor(columns: Columns) {
        this.columns = columns;
        this.rows = [];
    }

    public insert(row: {
        [key: string]: { data: string | number | boolean | Date | JSONResolvable }
    }) {
        const newRow: {
            id: string;
            data: { [key: string]: JSONResolvable };
        } = {
            id: crypto.randomBytes(16).toString('hex'),
            data: {}
        };

        for (const col of Object.keys(row)) {
            const column = this.columns.find((c) => c.name === col);

            if (!column) {
                throw new Error(`Column ${col} does not exist`);
            }

            if (column.default && !row[col]) {
                row[col].data = column.default;
            }

            if (column.required && row[col].data === undefined) {
                throw new Error(`Column ${col} is required`);
            }

            if (column.unique) {
                const existingRow = this.rows.find((r) => r.data[col] === row[col].data);

                if (existingRow) {
                    throw new Error(`Column ${col} must be unique`);
                }
            }

            switch (column.type) {
                case 'string':
                    if (typeof row[col].data !== 'string') {
                        throw new Error(`Column ${col} must be of type string. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'number':
                    if (typeof row[col].data !== 'number') {
                        throw new Error(`Column ${col} must be of type number. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'boolean':
                    if (typeof row[col].data !== 'boolean') {
                        throw new Error(`Column ${col} must be of type boolean. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'date':
                    if (!(row[col].data instanceof Date)) {
                        throw new Error(`Column ${col} must be of type date. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'json':
                    if (typeof row[col].data !== 'object') {
                        throw new Error(`Column ${col} must be of type json. Got ${typeof row[col].data}`);
                    }

                    break;

                default:
                    throw new Error(`Column ${col} has an invalid type`);
            }

            newRow.data[col] = row[col].data;
        }

        this.rows.push(newRow);

        return newRow;
    }

    public select() {
        return this.rows;
    }

    public selectOne(id: string) {
        return this.rows.find((r) => r.id === id);
    }

    public selectWhere(where: {
        [key: string]: { data: string | number | boolean | Date | JSONResolvable }
    }) {
        return this.rows.filter((r) => {
            for (const col of Object.keys(where)) {
                if (r.data[col] !== where[col].data) {
                    return false;
                }
            }

            return true;
        });
    }

    public update(id: string, row: {
        [key: string]: { data: string | number | boolean | Date | JSONResolvable }
    }) {
        const existingRow = this.rows.find((r) => r.id === id);

        if (!existingRow) {
            throw new Error(`Row ${id} does not exist`);
        }

        for (const col of Object.keys(row)) {
            const column = this.columns.find((c) => c.name === col);

            if (!column) {
                throw new Error(`Column ${col} does not exist`);
            }

            if (column.default && !row[col]) {
                row[col].data = column.default;
            }

            if (column.required && row[col].data === undefined) {
                throw new Error(`Column ${col} is required`);
            }

            if (column.unique) {
                const existingRow = this.rows.find((r) => r.data[col] === row[col].data);

                if (existingRow) {
                    throw new Error(`Column ${col} must be unique`);
                }
            }

            switch (column.type) {
                case 'string':
                    if (typeof row[col].data !== 'string') {
                        throw new Error(`Column ${col} must be of type string. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'number':
                    if (typeof row[col].data !== 'number') {
                        throw new Error(`Column ${col} must be of type number. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'boolean':
                    if (typeof row[col].data !== 'boolean') {
                        throw new Error(`Column ${col} must be of type boolean. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'date':
                    if (!(row[col].data instanceof Date)) {
                        throw new Error(`Column ${col} must be of type date. Got ${typeof row[col].data}`);
                    }

                    break;
                case 'json':
                    if (typeof row[col].data !== 'object') {
                        throw new Error(`Column ${col} must be of type json. Got ${typeof row[col].data}`);
                    }

                    break;

                default:
                    throw new Error(`Column ${col} has an invalid type`);
            }

            existingRow.data[col] = row[col].data;
        }

        return existingRow;
    }

    public delete(id: string) {
        const existingRow = this.rows.find((r) => r.id === id);

        if (!existingRow) {
            throw new Error(`Row ${id} does not exist`);
        }

        this.rows = this.rows.filter((r) => r.id !== id);

        return existingRow;
    }

    public deleteWhere(where: {
        [key: string]: { data: JSONResolvable }
    }) {
        const rows = this.rows.filter((r) => {
            for (const col of Object.keys(where)) {
                if (r.data[col] !== where[col].data) {
                    return false;
                }
            }

            return true;
        });

        this.rows = this.rows.filter((r) => {
            for (const col of Object.keys(where)) {
                if (r.data[col] !== where[col].data) {
                    return true;
                }
            }

            return false;
        });

        return rows;
    }

    public deleteAll() {
        const rows = this.rows;

        this.rows = [];

        return rows;
    }

    public getColumns() {
        return this.columns;
    }

    public getColumn(name: string) {
        return this.columns.find((c) => c.name === name);
    }

    public exportAsJSON() {
        return {
            columns: this.columns,
            rows: this.rows,
        };
    }

    public exportAsBinary() {
        return v8.serialize(this.exportAsJSON());
    }

    public importFromJSON(data: {
        columns: Columns;
        rows: {
            id: string;
            data: {
                [key: string]: JSONResolvable;
            };
        }[];
    }) {
        this.columns = data.columns;
        this.rows = data.rows;
    }

    public importFromBinary(data: Buffer) {
        this.importFromJSON(v8.deserialize(data));
    }
}
