import { Pool } from 'mysql2/promise';
export declare class MysqlService {
    connectionPool: Pool;
    private isProduction;
    private readonly logger;
    private dbInfo;
    constructor();
    escape(statement: any): string;
}
