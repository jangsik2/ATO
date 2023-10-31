import { Injectable, Logger } from '@nestjs/common';
import { Pool, PoolOptions, createPool, escape } from 'mysql2/promise';

@Injectable()
export class MysqlService {

  // Can use DB connection pool by use this
  public connectionPool: Pool;
  private isProduction: boolean = (process.env.NODE_ENV === "production");

  private readonly logger = new Logger(MysqlService.name);

  private dbInfo: PoolOptions = {
    host: process.env.DATABASE_HOST as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    database: process.env.DATABASE_SCHEMA as string,
    port: parseInt(process.env.DATABASE_PORT) ?? 3306,
    waitForConnections: true,
    keepAliveInitialDelay: 10000,
    multipleStatements: true,
    enableKeepAlive: true
  }

  constructor(){
    this.connectionPool = createPool(this.dbInfo);
  }

  public escape(statement: any){
    return escape(statement);
  }

}