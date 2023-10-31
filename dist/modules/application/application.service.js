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
var ApplicationService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../../providers/mysql/mysql.service");
const dynamodb_service_1 = require("../../providers/dynamodb/dynamodb.service");
const s3_service_1 = require("../../providers/s3/s3.service");
let ApplicationService = ApplicationService_1 = class ApplicationService {
    constructor(mysql, s3, dynamodb) {
        this.mysql = mysql;
        this.s3 = s3;
        this.dynamodb = dynamodb;
        this.dynamoDBApplicationTable = "IAO_Order_Application";
        this.logger = new common_1.Logger(ApplicationService_1.name);
    }
    async getApplication(requestData) {
        if (!requestData.orderId)
            throw new common_1.BadRequestException(`There is no orderId data`, { description: "3082" });
        let applicationData = await this.dynamodb.getItem({ TableName: this.dynamoDBApplicationTable, Key: {
                orderId: requestData.orderId
            } });
        if (!applicationData)
            throw new common_1.NotFoundException(`There is no application data`, { description: "3081" });
        return applicationData;
    }
};
ApplicationService = ApplicationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        s3_service_1.S3Service, typeof (_a = typeof dynamodb_service_1.DynamodbService !== "undefined" && dynamodb_service_1.DynamodbService) === "function" ? _a : Object])
], ApplicationService);
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map