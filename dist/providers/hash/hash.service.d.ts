export declare class HashService {
    saltRounds: number;
    constructor();
    hashPassword(plainText: string): Promise<string>;
    comparePassword(plainText: string, hash: string): Promise<boolean>;
}
