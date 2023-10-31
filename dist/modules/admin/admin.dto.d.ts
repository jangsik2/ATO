export declare class createAccountDto {
    phoneNumber: string;
    name: string;
    email: string;
    password: string;
}
export declare class loginFirstDto {
    phoneNumber: string;
    password: string;
}
export declare class loginSecondDto {
    authToken: string;
    otpNumber: string;
}
export declare class removeAccount {
    phoneNumber: string;
}
export declare class admin {
    adminId: number;
    phoneNumber: string;
    email: string;
    name: string;
    updated_at: string;
    adminPermissions: string;
}
export declare class getTranslatorListDto {
    languageCode: string;
}
