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
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let JwtService = class JwtService {
    constructor() {
        this.exp = 60 * 60 * 24;
    }
    generate(objectData, exp) {
        let generatedJWT = jwt.sign({ data: objectData }, process.env.HASH_JWT_SECRET, { expiresIn: (exp) ? exp : this.exp });
        return generatedJWT;
    }
    decode(inputJWT) {
        return new Promise(function (rs, rj) {
            jwt.verify(inputJWT, process.env.HASH_JWT_SECRET, function (err, decoded) {
                if (err)
                    rs({ error: true, message: "Invalid token" });
                return rs(decoded);
            });
        });
    }
};
JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtService);
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map