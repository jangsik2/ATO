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
var NaverblogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaverblogService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mysql_service_1 = require("../../providers/mysql/mysql.service");
const s3_service_1 = require("../../providers/s3/s3.service");
let NaverblogService = NaverblogService_1 = class NaverblogService {
    constructor(mysql, s3) {
        this.mysql = mysql;
        this.s3 = s3;
        this.params = {
            blogId: "transsolution",
            readPostNumber: 5,
            s3Bucket: "iaonaverblogthumbnail",
        };
        this.logger = new common_1.Logger(NaverblogService_1.name);
    }
    resetTodayCount() {
        this.createPost();
    }
    async createPost() {
        const logger = this.logger;
        const mysql = this.mysql;
        logger.log("Reload naverblog post");
        let myHeaders = new Headers();
        myHeaders.append("authority", "blog.naver.com");
        myHeaders.append("referer", `https://blog.naver.com/${this.params.blogId}`);
        myHeaders.append("accept-language", "ko,ko-KR;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6");
        myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
        myHeaders.append("sec-fetch-dest", "empty");
        myHeaders.append("sec-fetch-mode", "cors");
        myHeaders.append("sec-fetch-site", "same-origin");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`https://m.blog.naver.com/api/blogs/${this.params.blogId}/post-list?categoryNo=0&itemCount=${this.params.readPostNumber}&page=1`, requestOptions)
            .then(response => response.text())
            .then(async (result) => {
            var _a, _b, _c, _d;
            let data;
            try {
                data = JSON.parse(result);
            }
            catch (e) {
                logger.error("Failed to set naverblog newest data : 1037");
            }
            let postData = (_a = data === null || data === void 0 ? void 0 : data.result) === null || _a === void 0 ? void 0 : _a.items;
            if (!postData)
                logger.error("Failed to set naverblog newest data : 1038");
            let insertData = [];
            for (let i = 0; i < postData.length; i++) {
                if (!((_b = postData[i]) === null || _b === void 0 ? void 0 : _b.thumbnailUrl))
                    continue;
                fetch(postData[i].thumbnailUrl + "?type=ffn640_640")
                    .then(res => res.arrayBuffer())
                    .then(async (res) => {
                    await this.s3.uploadFile({ Bucket: this.params.s3Bucket, Key: `${postData[i].logNo}.png`, Body: res });
                }).catch(err => {
                    console.log(123, err);
                    logger.error("Failed to set naverblog newest data : 1039");
                });
            }
            for (let i = 0; i < postData.length; i++) {
                if (!((_c = postData[i]) === null || _c === void 0 ? void 0 : _c.thumbnailUrl))
                    continue;
                insertData.push({
                    naverBlogPostId: mysql.escape(postData[i].logNo),
                    blogId: "transsolution",
                    title: mysql.escape(postData[i].titleWithInspectMessage),
                    content: mysql.escape(postData[i].briefContents),
                    thumbnailUrl: mysql.escape(`https://iaonaverblogthumbnail.s3.ap-northeast-2.amazonaws.com/${postData[i].logNo}.png`),
                    naverBlogPostCategoryId: mysql.escape(postData[i].categoryNo),
                    created_at: mysql.escape(getKoreanTime(postData[i].addDate))
                });
            }
            let insertQuery = "";
            for (let i = 0; i < insertData.length; i++) {
                if (!((_d = postData[i]) === null || _d === void 0 ? void 0 : _d.thumbnailUrl))
                    continue;
                insertQuery += `
          INSERT IGNORE INTO naverBlogPost
          SET
            naverBlogPostId = ${insertData[i].naverBlogPostId},
            naverBlogPostCategoryId = ${insertData[i].naverBlogPostCategoryId},
            blogId = "${insertData[i].blogId}",
            title = ${insertData[i].title},
            content = ${insertData[i].content},
            thumbnailUrl = ${insertData[i].thumbnailUrl},
            created_at = ${insertData[i].created_at}
          ;
          `;
            }
            this.mysql.connectionPool.query(insertQuery);
        })
            .catch(error => "Failed to set naverblog newest data : 1044");
        return;
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NaverblogService.prototype, "resetTodayCount", null);
NaverblogService = NaverblogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        s3_service_1.S3Service])
], NaverblogService);
exports.NaverblogService = NaverblogService;
function getKoreanTime(timeStamp) {
    var today = new Date(timeStamp);
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var hour = (today.getHours() >= 10 ? today.getHours().toString() : '0' + today.getHours().toString());
    var minutes = (today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes());
    var getKoreanTime = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes;
    return getKoreanTime;
}
//# sourceMappingURL=naverblog.service.js.map