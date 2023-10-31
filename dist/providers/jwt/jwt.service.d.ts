export declare class JwtService {
    exp: number;
    constructor();
    generate(objectData: Object, exp?: number): string;
    decode(inputJWT: string): Promise<object>;
}
