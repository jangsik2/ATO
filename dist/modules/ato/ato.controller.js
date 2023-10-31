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
exports.AtoController = void 0;
const common_1 = require("@nestjs/common");
const ato_service_1 = require("./ato.service");
let AtoController = class AtoController {
    constructor(atoService) {
        this.atoService = atoService;
    }
    async wordstatus(req, res) {
        let sortedData = await this.atoService.productload(req.query.documentId);
        let pickUpData;
        let status;
        if (sortedData[1][5].includes("가")) {
            pickUpData = await this.atoService.familyDocument(sortedData);
            status = await this.atoService.fmailyTranslate(pickUpData, "en", req.query.documentId, "", false);
        }
        else if (sortedData[1][5].includes("기")) {
            pickUpData = await this.atoService.basicDocument(sortedData);
            status = await this.atoService.basicTranslate(pickUpData, "en", req.query.documentId, "", false);
        }
        else if (sortedData[1][5].includes("혼")) {
            pickUpData = await this.atoService.marriagageDocument(sortedData);
            status = await this.atoService.marriagageTranslate(pickUpData, "en", req.query.documentId, "", false);
        }
        return res.status(200).send({ status: status });
    }
    async atoPost(requestData, req, res) {
        console.log(requestData);
        let buffer = await this.atoService.wordDownload(requestData.data, requestData.status);
        console.log(buffer);
        return res.status(200).send(buffer);
    }
    async translateName(req, res) {
        let result = await this.atoService.translateName(req.query.translateName);
        return res.status(200).send({ translatedText: result });
    }
    async test(req, res) {
        return res.status(200).send("test");
    }
};
__decorate([
    (0, common_1.Get)('wordstatus'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AtoController.prototype, "wordstatus", null);
__decorate([
    (0, common_1.Post)('download'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AtoController.prototype, "atoPost", null);
__decorate([
    (0, common_1.Get)('translateName'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AtoController.prototype, "translateName", null);
__decorate([
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AtoController.prototype, "test", null);
AtoController = __decorate([
    (0, common_1.Controller)('ato'),
    __metadata("design:paramtypes", [ato_service_1.AtoService])
], AtoController);
exports.AtoController = AtoController;
//# sourceMappingURL=ato.controller.js.map