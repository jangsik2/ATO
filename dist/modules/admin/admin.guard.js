"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RolesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_service_1 = require("../../providers/jwt/jwt.service");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
let RolesGuard = RolesGuard_1 = class RolesGuard {
    constructor(reflector, jwt) {
        this.reflector = reflector;
        this.jwt = jwt;
        this.logger = new common_1.Logger(RolesGuard_1.name);
    }
    async canActivate(context) {
        let isProduction = (process.env.NODE_ENV === "production");
        if (!isProduction) {
            this.logger.warn("Temporary login!!");
            let tempDecodeJWT = {
                "adminId": 2041,
                "phoneNumber": "01087920281",
                "email": "shck1010@naver.com",
                "name": "이혁주",
                "updated_at": "2023-07-11T01:45:00.000Z",
                "adminPermissions": [
                    "SU",
                    "TOM",
                    "OM"
                ]
            };
            const tempReq = context.switchToHttp().getRequest();
            tempReq.admin = tempDecodeJWT;
            return true;
        }
        const roles = this.reflector.get('roles', context.getHandler());
        roles.push("SU");
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        let adminToken = req.cookies['adminToken'];
        if (!adminToken)
            return false;
        let decodeJWT = await this.jwt.decode(adminToken);
        if (decodeJWT['error'])
            return false;
        let adminPermissions = decodeJWT.data.adminPermissions;
        for (let i = 0; i < adminPermissions.length; i++) {
            if (roles.includes(adminPermissions[i]))
                break;
            if (i == adminPermissions.length - 1)
                return false;
        }
        console.log("PASS GUARD");
        req.admin = decodeJWT.data;
        return true;
    }
};
RolesGuard = RolesGuard_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_service_1.JwtService])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=admin.guard.js.map