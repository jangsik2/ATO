import { MysqlService } from '../../providers/mysql/mysql.service';
import { DynamodbService } from '../../providers/dynamodb/dynamodb.service';
import { JwtService } from '../../providers/jwt/jwt.service';
import { HashService } from '../../providers/hash/hash.service';
import * as dto from './admin.dto';
export declare class AdminService {
    private readonly mysql;
    private readonly dynamodb;
    private readonly jwt;
    private readonly hash;
    constructor(mysql: MysqlService, dynamodb: DynamodbService, jwt: JwtService, hash: HashService);
    createAccount(requestData: dto.createAccountDto): Promise<string>;
    verifyAdminAccount(): Promise<void>;
    loginFirst(requestData: dto.loginFirstDto): Promise<{
        token: string;
    }>;
    loginSecond(res: any, requestData: dto.loginSecondDto): Promise<dto.admin>;
    private setAdminToken;
    removeAdminToken(res: any): void;
    createOtp(phoneNumber: string): Promise<{
        secret: string;
        qrCode: string;
    }>;
    checkOTP(base32secret: string, otpNumber: string): Promise<any>;
    getAdminByPermission(permission: string | string[]): Promise<dto.admin[]>;
}
