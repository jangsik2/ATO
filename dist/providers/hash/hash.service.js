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
exports.HashService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require('bcrypt');
let HashService = class HashService {
    constructor() {
        this.saltRounds = Number(process.env.BCRYPT_SALTROUNDS);
    }
    async hashPassword(plainText) {
        return new Promise((rs, rj) => {
            bcrypt.hash(plainText, this.saltRounds, function (err, hash) {
                if (err)
                    return rj(err);
                return rs(hash);
            });
        });
    }
    async comparePassword(plainText, hash) {
        return new Promise((rs, rj) => {
            bcrypt.compare(plainText, hash, function (err, result) {
                if (err)
                    return rj(err);
                return rs(result);
            });
        });
    }
};
HashService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HashService);
exports.HashService = HashService;
//# sourceMappingURL=hash.service.js.map