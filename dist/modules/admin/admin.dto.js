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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslatorListDto = exports.admin = exports.removeAccount = exports.loginSecondDto = exports.loginFirstDto = exports.createAccountDto = void 0;
const class_validator_1 = require("class-validator");
class createAccountDto {
}
__decorate([
    (0, class_validator_1.IsMobilePhone)(),
    __metadata("design:type", String)
], createAccountDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createAccountDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], createAccountDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createAccountDto.prototype, "password", void 0);
exports.createAccountDto = createAccountDto;
class loginFirstDto {
}
__decorate([
    (0, class_validator_1.IsMobilePhone)(),
    __metadata("design:type", String)
], loginFirstDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], loginFirstDto.prototype, "password", void 0);
exports.loginFirstDto = loginFirstDto;
class loginSecondDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], loginSecondDto.prototype, "authToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], loginSecondDto.prototype, "otpNumber", void 0);
exports.loginSecondDto = loginSecondDto;
class removeAccount {
}
__decorate([
    (0, class_validator_1.IsMobilePhone)(),
    __metadata("design:type", String)
], removeAccount.prototype, "phoneNumber", void 0);
exports.removeAccount = removeAccount;
class admin {
}
exports.admin = admin;
class getTranslatorListDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], getTranslatorListDto.prototype, "languageCode", void 0);
exports.getTranslatorListDto = getTranslatorListDto;
//# sourceMappingURL=admin.dto.js.map