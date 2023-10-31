import { S3Client } from '@aws-sdk/client-s3';
export declare class S3Service {
    client: S3Client;
    constructor();
    uploadFile(params: {
        Bucket: string;
        Key: string;
        Body: any;
        ContentType?: string;
    }): Promise<any>;
    getObject(params: {
        Bucket: string;
        Key: string;
    }): Promise<any>;
    getPresignedReadUrl(params: {
        Bucket: string;
        Key: string;
    }): Promise<string>;
}
