import { MysqlService } from '../../providers/mysql/mysql.service';
import { DynamodbService } from '../../providers/dynamodb/dynamodb.service';
import { S3Service } from '../../providers/s3/s3.service';
import * as dto from './application.dto';
export declare class ApplicationService {
    private readonly mysql;
    private readonly s3;
    private readonly dynamodb;
    dynamoDBApplicationTable: string;
    private readonly logger;
    constructor(mysql: MysqlService, s3: S3Service, dynamodb: DynamodbService);
    getApplication(requestData: dto.getApplicationDto): Promise<dto.dynamoDbApplication>;
}
