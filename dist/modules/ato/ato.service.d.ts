import { MysqlService } from '../../providers/mysql/mysql.service';
import { S3Service } from '../../providers/s3/s3.service';
export declare class AtoService {
    private readonly mysql;
    private readonly s3;
    constructor(mysql: MysqlService, s3: S3Service);
    test(params: any): Promise<void>;
    sortBBOX(data: any): Promise<any>;
    load(documentId: any): Promise<any>;
    familyDocument(fullText: any): Promise<{
        documentTitle: any;
        principal: {
            name: string;
            birth: string;
            RRN: string;
            gender: string;
            surnameOrigin: string;
        };
        father: {
            status: number;
            name: string;
            birth: string;
            RRN: string;
            gender: string;
            surnameOrigin: string;
        };
        mother: {
            status: number;
            name: string;
            birth: string;
            RRN: string;
            gender: string;
            surnameOrigin: string;
        };
        spouse: {
            status: number;
            name: string;
            birth: string;
            RRN: string;
            gender: string;
            surnameOrigin: string;
            country: string;
        };
        child: any[];
        detail: any;
        address: string;
        closure: string;
        diplomaticMA: string;
        timeIssue: string;
        dateIssue: string;
        agencyIssue: string;
        issuer: string;
        number: string;
        applicant: string;
        text1: string;
        text2: string;
    }>;
    fmailyTranslate(data: any, language: any, documentId: any, Dtype: any, reload: any): Promise<number>;
    basicDocument(fullText: any): Promise<{
        address: string;
        documentTitle: any;
        principal: {
            name: string;
            birth: string;
            gender: string;
            RRN: string;
            surnameOrigin: string;
        };
        detailUp: {
            category: any;
            content: any[];
        }[];
        detailDown: {
            category: any;
            content: any[];
        }[];
        closure: string;
        dateIssue: string;
        agencyIssue: string;
        applicant: string;
        timeIssue: string;
        issuer: string;
        number: string;
        diplomaticMA: string;
        text1: string;
        text2: string;
    }>;
    basicTranslate(data: any, language: any, documentId: any, Dtype: any, reload: any): Promise<number>;
    marriagageDocument(fullText: any): Promise<{
        address: string;
        documentTitle: any;
        principal: {
            name: string;
            birth: string;
            RRN: string;
            gender: string;
            surnameOrigin: string;
        };
        spouse: {
            status: number;
            name: string;
            birth: string;
            RRN: string;
            gender: string;
            surnameOrigin: string;
            country: string;
        };
        detail: {
            category: string;
            content: any[];
        }[];
        closure: string;
        diplomaticMA: string;
        dateIssue: string;
        agencyIssue: string;
        applicant: string;
        issuer: string;
        timeIssue: string;
        number: string;
        text1: string;
        text2: string;
    }>;
    marriagageTranslate(data: any, language: any, documentId: any, Dtype: any, reload: any): Promise<number>;
    wordDownload(data: any, status: any): Promise<any>;
    familyMakeWordDocument(data: any): Promise<any>;
    basicMakeWordDocument(data: any): Promise<any>;
    marriagageMakeWordDocument(data: any): Promise<any>;
    certiDownload(): Promise<void>;
    translateName(input: any): Promise<string>;
    translateAddress(data: any): Promise<any>;
    getKoreanAddressInString(targetString: any): Promise<any[]>;
    productload(documentId: any): Promise<any>;
}
