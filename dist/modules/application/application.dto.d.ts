export declare class getApplicationDto {
    orderId: string;
}
export declare class dynamoDbApplication {
    orderId: string;
    orderName: string;
    orderUser: {
        userinfoId: number;
        phoneNumber: string;
        phoneCode: string;
        email: string;
        uname: string;
        guest: boolean;
    };
    applicant: {
        isOrderer: boolean;
        info?: {
            name: string;
            phoneCode: string;
            phoneNumber: string;
            email: string;
        };
    };
    identityFiles?: {
        uploadedFileId: string;
        originalname: string;
    }[];
    balgeubdaehaeng: dynamoDbBalgeubdaehaeng;
    additionalInfo?: object;
    additionalRequest?: string;
    documents: dynamoDbDocument[];
    created_at: number;
}
export declare class dynamoDbDocument {
    documentId: string;
    P_code: string;
    name_kr: string;
    name_en: string;
    inputs: dynamoDbDocumentInput[];
    files: {
        uploadedFileId: string;
        originalname: string;
    }[];
    fileTransferMethod: "fileUpload" | "sendPost" | "visitCompany" | "balgeubdaehaeng";
    combinedFileId?: string;
    options: {
        isCertification: boolean;
        isApostille: boolean;
        isConsular: boolean;
    };
}
export declare class dynamoDbDocumentInput {
    type: "IL1S" | "IL1B" | "IL2" | "IL3";
    length: number;
    name_kr: string;
    name_en: string;
    data: string[];
}
export declare class dynamoDbBalgeubdaehaeng {
    isBalgeubdaehaeng: boolean;
    info?: {
        delegator: {
            name: string;
            identityNumber: string;
            phoneNumber: string;
            address: {
                postalCode: string;
                address1: string;
                address2: string;
            };
        };
        inputs: dynamoDbDocumentInput[];
    };
}
