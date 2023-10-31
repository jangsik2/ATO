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
var MysqlService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
let MysqlService = MysqlService_1 = class MysqlService {
    constructor() {
        var _a;
        this.isProduction = (process.env.NODE_ENV === "production");
        this.logger = new common_1.Logger(MysqlService_1.name);
        this.dbInfo = {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_SCHEMA,
            port: (_a = parseInt(process.env.DATABASE_PORT)) !== null && _a !== void 0 ? _a : 3306,
            waitForConnections: true,
            keepAliveInitialDelay: 10000,
            multipleStatements: true,
            enableKeepAlive: true
        };
        this.connectionPool = (0, promise_1.createPool)(this.dbInfo);
    }
    escape(statement) {
        return (0, promise_1.escape)(statement);
    }
};
MysqlService = MysqlService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MysqlService);
exports.MysqlService = MysqlService;
//# sourceMappingURL=mysql.service.js.map