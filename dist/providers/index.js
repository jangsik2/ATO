"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = void 0;
const common_1 = require("@nestjs/common");
const mysql_module_1 = require("./mysql/mysql.module");
const s3_module_1 = require("./s3/s3.module");
const hash_module_1 = require("./hash/hash.module");
const jwt_module_1 = require("./jwt/jwt.module");
const websocket_module_1 = require("./websocket/websocket.module");
let Providers = class Providers {
};
Providers = __decorate([
    (0, common_1.Module)({
        imports: [
            mysql_module_1.MysqlModule,
            s3_module_1.S3Module,
            hash_module_1.HashModule,
            jwt_module_1.JwtModule,
            websocket_module_1.WebsocketModule,
        ]
    })
], Providers);
exports.Providers = Providers;
//# sourceMappingURL=index.js.map