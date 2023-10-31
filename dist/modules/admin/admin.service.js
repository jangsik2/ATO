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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../../providers/mysql/mysql.service");
const dynamodb_service_1 = require("../../providers/dynamodb/dynamodb.service");
const jwt_service_1 = require("../../providers/jwt/jwt.service");
const hash_service_1 = require("../../providers/hash/hash.service");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
let AdminService = class AdminService {
    constructor(mysql, dynamodb, jwt, hash) {
        this.mysql = mysql;
        this.dynamodb = dynamodb;
        this.jwt = jwt;
        this.hash = hash;
    }
    async createAccount(requestData) {
        var _a, _b;
        let hashedPassword = await this.hash.hashPassword(requestData.password);
        let currentTime = getCurrentTime();
        let otpData = await this.createOtp(requestData.phoneNumber);
        let dbRes = await this.mysql.connectionPool.execute(`SELECT exists(SELECT * FROM admin WHERE phoneNumber = ?) as exist;`, [requestData.phoneNumber]);
        let isExistSamePhone = (_b = (_a = dbRes === null || dbRes === void 0 ? void 0 : dbRes[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.exist;
        if (isExistSamePhone)
            throw new common_1.BadRequestException("Already exist same phone number", { description: "1002" });
        await this.mysql.connectionPool.execute(`
    INSERT INTO admin 
    SET
      phoneNumber = ?,
      email = ?,
      pw = ?,
      uname = ?,
      active = 1,
      created_at = ?,
      updated_at = ?,
      otpSecret = ?
    `, [requestData.phoneNumber, requestData.email, hashedPassword, requestData.name, currentTime, currentTime, otpData.secret]);
        return otpData.qrCode;
    }
    async verifyAdminAccount() {
        return;
    }
    async loginFirst(requestData) {
        var _a;
        let dbRes = await this.mysql.connectionPool.execute(`
    SELECT * FROM admin
    WHERE 
      phoneNumber = ?
    `, [requestData.phoneNumber]);
        let selectedAdmin = (_a = dbRes === null || dbRes === void 0 ? void 0 : dbRes[0]) === null || _a === void 0 ? void 0 : _a[0];
        if (!selectedAdmin)
            throw new common_1.BadRequestException("Not valid user phoneNumber and password", { description: "1004" });
        let adminHashedPassword = selectedAdmin.pw;
        let isValidPassword = await this.hash.comparePassword(requestData.password, adminHashedPassword);
        if (!isValidPassword)
            throw new common_1.BadRequestException("Not valid user phoneNumber and password", { description: "1004" });
        let authData = { phoneNumber: requestData.phoneNumber };
        let generatedJWT = this.jwt.generate(authData, 60 * 5);
        return { token: generatedJWT };
    }
    async loginSecond(res, requestData) {
        var _a, _b, _c;
        let decodeJWT = await this.jwt.decode(requestData.authToken);
        if (decodeJWT['error'])
            throw new common_1.UnauthorizedException("유효한 로그인 토큰이 아닙니다.", { description: "1001" });
        let userPhoneNumber = (_a = decodeJWT.data) === null || _a === void 0 ? void 0 : _a.phoneNumber;
        if (!userPhoneNumber)
            throw new common_1.UnauthorizedException("유효한 로그인 토큰이 아닙니다.", { description: "1001" });
        let dbRes = await this.mysql.connectionPool.execute(`
    SELECT
      adminId,
      phoneNumber,
      email,
      uname,
      updated_at,
      active,
      adminPermissions,
      otpSecret
    FROM admin
    WHERE 
      phoneNumber = ?
    `, [userPhoneNumber]);
        let selectedAdmin = (_b = dbRes === null || dbRes === void 0 ? void 0 : dbRes[0]) === null || _b === void 0 ? void 0 : _b[0];
        if (!selectedAdmin)
            throw new common_1.UnauthorizedException("유효한 로그인 토큰이 아닙니다.", { description: "1001" });
        let isValidOtp = await this.checkOTP(selectedAdmin.otpSecret, requestData.otpNumber);
        if (!isValidOtp)
            throw new common_1.UnauthorizedException("Invalid OTP", { description: "1003" });
        let currentTime = getCurrentTime();
        this.mysql.connectionPool.execute("UPDATE admin SET updated_at = ? where phoneNumber = ?", [currentTime, userPhoneNumber]);
        if (!selectedAdmin.adminPermissions)
            throw new common_1.ForbiddenException("아무 권한이 없는 어드민은 로그인 할 수 없습니다.", { description: "1004" });
        if (!((_c = selectedAdmin.adminPermissions) === null || _c === void 0 ? void 0 : _c.length) || selectedAdmin.adminPermissions.length === 0)
            throw new common_1.ForbiddenException("아무 권한이 없는 어드민은 로그인 할 수 없습니다.", { description: "1004" });
        let userData = {
            adminId: selectedAdmin.adminId,
            phoneNumber: selectedAdmin.phoneNumber,
            email: selectedAdmin.email,
            name: selectedAdmin.uname,
            updated_at: selectedAdmin.updated_at,
            adminPermissions: selectedAdmin.adminPermissions
        };
        let generatedJWT = this.jwt.generate(userData);
        this.setAdminToken(res, generatedJWT);
        return userData;
    }
    setAdminToken(res, token) {
        res.cookie("adminToken", token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 12
        });
        return true;
    }
    removeAdminToken(res) {
        res.clearCookie("adminToken", {
            sameSite: 'none',
            secure: true
        });
        return;
    }
    async createOtp(phoneNumber) {
        let secret = speakeasy.generateSecret({
            length: 10,
            name: "IAO Admin: " + phoneNumber,
        });
        let base32secret = secret.base32;
        let qrCode = await generateQRCode(secret.otpauth_url);
        return { qrCode: qrCode, secret: base32secret };
    }
    async checkOTP(base32secret, otpNumber) {
        let verified = speakeasy.totp.verify({
            secret: base32secret,
            encoding: 'base32',
            token: String(otpNumber)
        });
        return verified;
    }
    async getAdminByPermission(permission) {
        let permissionList;
        if (typeof permission === "string")
            permissionList = [permission];
        else
            permissionList = permission;
        let dbRes = await this.mysql.connectionPool.execute(`
    SELECT
      adminId,
      phoneNumber,
      email,
      uname as name,
      adminPermissions
    FROM admin
    WHERE adminPermissions IS NOT NULL
    AND active = 1;
    `);
        let totalAdminList = dbRes === null || dbRes === void 0 ? void 0 : dbRes[0];
        let selectedAdminList = [];
        label: for (let i = 0; i < totalAdminList.length; i++) {
            for (let j = 0; j < permissionList.length; j++) {
                if (totalAdminList[i].adminPermissions.includes(permissionList[j])) {
                    selectedAdminList.push(totalAdminList[i]);
                    continue label;
                }
            }
        }
        return selectedAdminList;
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, typeof (_a = typeof dynamodb_service_1.DynamodbService !== "undefined" && dynamodb_service_1.DynamodbService) === "function" ? _a : Object, jwt_service_1.JwtService,
        hash_service_1.HashService])
], AdminService);
exports.AdminService = AdminService;
function getCurrentTime() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var hour = (today.getHours() >= 10 ? today.getHours().toString() : '0' + today.getHours().toString());
    var minutes = (today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes());
    var currentTime = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes;
    return currentTime;
}
function generateQRCode(data) {
    return new Promise((rs, rj) => {
        QRCode.toDataURL(data, function (err, data_url) {
            if (err)
                throw err;
            return rs(data_url);
        });
    });
}
//# sourceMappingURL=admin.service.js.map