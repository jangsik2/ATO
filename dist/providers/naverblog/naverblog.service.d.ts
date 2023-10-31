import { MysqlService } from '../../providers/mysql/mysql.service';
import { S3Service } from '../../providers/s3/s3.service';
export declare class NaverblogService {
    private readonly mysql;
    private readonly s3;
    private params;
    private readonly logger;
    constructor(mysql: MysqlService, s3: S3Service);
    resetTodayCount(): void;
    createPost(): Promise<void>;
}
