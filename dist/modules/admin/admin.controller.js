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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_guard_1 = require("./admin.guard");
const dto = require("./admin.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async phoneAuth_Confirm(requestData, req, res) {
        let createdSecretQRData = await this.adminService.createAccount(requestData);
        let imgTag = `<img src="${createdSecretQRData}">`;
        return res.status(200).send(imgTag);
    }
    async loginFirst(requestData, req, res) {
        let authToken = await this.adminService.loginFirst(requestData);
        return res.status(200).send(authToken);
    }
    async loginSecond(requestData, req, res) {
        let userData = await this.adminService.loginSecond(res, requestData);
        return res.status(200).send(userData);
    }
    async signout(req, res) {
        this.adminService.removeAdminToken(res);
        return res.status(200).send({ error: false, message: "Logout success" });
    }
    async getAdminList(req, res) {
        let adminList = await this.adminService.getAdminByPermission(["OM"]);
        adminList.forEach((index) => {
            delete index.adminPermissions;
        });
        return res.status(200).send(adminList);
    }
    async getTranslatorList(requestData, req, res) {
        let adminList = await this.adminService.getAdminByPermission(["TS"]);
        adminList.forEach((index) => {
            delete index.adminPermissions;
        });
        return res.status(200).send(adminList);
    }
};
__decorate([
    (0, admin_guard_1.Roles)(),
    (0, common_1.UseGuards)(admin_guard_1.RolesGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.createAccountDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "phoneAuth_Confirm", null);
__decorate([
    (0, common_1.Post)('loginFirst'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.loginFirstDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "loginFirst", null);
__decorate([
    (0, common_1.Post)('loginSecond'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.loginSecondDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "loginSecond", null);
__decorate([
    (0, common_1.Get)('signout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signout", null);
__decorate([
    (0, admin_guard_1.Roles)("TOM"),
    (0, common_1.UseGuards)(admin_guard_1.RolesGuard),
    (0, common_1.Get)('list/om'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminList", null);
__decorate([
    (0, admin_guard_1.Roles)("TOM, OM"),
    (0, common_1.UseGuards)(admin_guard_1.RolesGuard),
    (0, common_1.Get)('list/ts'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.getTranslatorListDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTranslatorList", null);
AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map