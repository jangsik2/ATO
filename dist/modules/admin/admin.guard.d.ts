import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../../providers/jwt/jwt.service';
export declare const Roles: (...roles: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class RolesGuard implements CanActivate {
    private reflector;
    private readonly jwt;
    private readonly logger;
    constructor(reflector: Reflector, jwt: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
