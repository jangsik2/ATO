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
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = class S3Service {
    constructor() {
        this.client = new client_s3_1.S3Client({
            apiVersion: '2006-03-01',
            region: "ap-northeast-2"
        });
    }
    async uploadFile(params) {
        let command = new client_s3_1.PutObjectCommand(params);
        await this.client.send(command);
        return;
    }
    async getObject(params) {
        let command = new client_s3_1.GetObjectCommand(params);
        let data = await this.client.send(command);
        return data;
    }
    async getPresignedReadUrl(params) {
        let command = new client_s3_1.GetObjectCommand(params);
        let url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: 60 * 5 });
        return url;
    }
};
S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map