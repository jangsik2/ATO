import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
export declare class DynamodbService {
    client: DynamoDBDocumentClient;
    constructor();
    createNewItem(params: {
        TableName: string;
        Item: any;
    }): Promise<any>;
    getItem(params: {
        TableName: string;
        Key: any;
    }): Promise<any>;
}
