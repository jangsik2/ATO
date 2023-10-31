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
exports.DynamodbService = void 0;
const common_1 = require("@nestjs/common");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
let DynamodbService = class DynamodbService {
    constructor() {
        let dynamoDB = new client_dynamodb_1.DynamoDBClient({
            region: "ap-northeast-2"
        });
        this.client = lib_dynamodb_1.DynamoDBDocument.from(dynamoDB);
    }
    async createNewItem(params) {
        const command = new lib_dynamodb_1.PutCommand({
            TableName: params.TableName,
            Item: params.Item,
        });
        await this.client.send(command);
        return;
    }
    async getItem(params) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: params.TableName,
            Key: params.Key
        });
        let data = await this.client.send(command);
        return data.Item;
    }
};
DynamodbService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DynamodbService);
exports.DynamodbService = DynamodbService;
//# sourceMappingURL=dynamodb.service.js.map