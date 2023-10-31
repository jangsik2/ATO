import { Injectable } from '@nestjs/common';

// Providers
import { MysqlService } from '../../providers/mysql/mysql.service';
import { S3Service } from '../../providers/s3/s3.service';


const axios = require('axios');
const levenshtein = require('js-levenshtein');
@Injectable()
export class AtoService {

  constructor(
    private readonly mysql: MysqlService,
    private readonly s3: S3Service,
  ) { }

  async test(params) {
    console.log(123123, params);

    const dbRes: any = await this.mysql.connectionPool.execute(`
    SELECT * FROM order WHERE orderId = "230630M001ENUSU745"
    `);
    console.log(3333, dbRes[0]);

    // const s3Data = await this.s3.getObject({ Bucket: "dev-iao-country-img", Key: "Country/abroad.png" })
    // // console.log(2222, s3Data);


    // const dynamodbData = await this.dynamodb.getItem(
    //   {
    //     TableName: "IAO_Order_Application",
    //     Key: { orderId: "230710M002ENUSQ94" }
    //   });
    // console.log(5555, dynamodbData);


    return
  }

  async sortBBOX(data) {
    const sortedCount = data.sort((a, b) => {
      if ((a[0][1] !== b[0][1]) && Math.abs(a[0][1] - b[0][1]) > 10) {
        return a[0][1] - b[0][1];
      }
      return a[0][0] - b[0][0];
    });
    return sortedCount
  }

  async load(documentId) {
    let result;
    try {
      await axios({
        method: 'get',
        url: 'https://r484a3v5w1.execute-api.ap-northeast-2.amazonaws.com/dev/TestOcr',
        header: {
          "Content-Type": "application/json",
        },
        params: { documentId: documentId }
      }).then(res => {
        result = res.data;
        return
      })
        .catch(err => {
          console.log(err);
          return
        })
    } catch {
      console.log('axios error');
      return
    }
    result = await result[0];
    return result;

  }

  async familyDocument(fullText) {
    const info = {
      documentTitle: fullText[1][5],
      principal: { name: "", birth: "", RRN: "", gender: "", surnameOrigin: "" },
      father: { status: 0, name: "", birth: "", RRN: "", gender: "", surnameOrigin: "" },
      mother: { status: 0, name: "", birth: "", RRN: "", gender: "", surnameOrigin: "" },
      spouse: { status: 0, name: "", birth: "", RRN: "", gender: "", surnameOrigin: "", country: "Korea", },
      child: [],
      detail: null,
      address: "",
      closure: "",
      diplomaticMA: "",
      timeIssue: "",
      dateIssue: "",
      agencyIssue: "",
      issuer: "",
      number: "",
      applicant: "",
      text1: "",
      text2: ""
    };
    var childCount = 0;
    console.log(fullText)
    for (var i = 0; i < fullText.length; i++) {
      console.log(fullText[i][5]);
      if (fullText[i][5] == "등록기준지") {
        if (fullText[i - 1][5] == "폐쇄")
          info.closure = fullText[i - 1][5];
        if (fullText[i - 2][5].startsWith('[') && fullText[i - 2][5].endsWith(']'))
          info.diplomaticMA = fullText[i - 2][5];
        info.address = fullText[++i][5];
      }
      if (fullText[i][5] == "본인") {
        info.principal.name = fullText[++i][5];
        info.principal.birth = fullText[++i][5];
        info.principal.RRN = fullText[++i][5];
        if (fullText[i + 1][5].includes(' ')) {
          var genderSurname = fullText[++i][5].split(' ');
          info.principal.gender = genderSurname[0];
          info.principal.surnameOrigin = genderSurname[1];
        } else {
          info.principal.gender = fullText[++i][5];
          info.principal.surnameOrigin = fullText[++i][5];
        }
      }
      if (fullText[i][5] == "부") {
        info.father.name = "";
        info.father.birth = "";
        info.father.RRN = "";
        info.father.gender = "";
        info.father.surnameOrigin = "";
        info.father.status = 0;
        if (fullText[i + 2][5] == '남') {
          info.father.name = fullText[++i][5];
          info.father.gender = fullText[++i][5];
          info.father.status = 1;
        } else {
          if (fullText[i + 1][5].includes("사망")) {
            var data = fullText[++i][5].split("사망");
            info.father.name = data[0];
            info.father.birth = data[1];
            info.father.status = 2;
          }
          else {
            info.father.name = fullText[++i][5];
            info.father.birth = fullText[++i][5];
            info.father.status = 1;
          }
          info.father.RRN = fullText[++i][5];
          if (fullText[i + 1][5].includes(' ')) {
            var genderSurname = fullText[++i][5].split(' ');
            info.father.gender = genderSurname[0];
            info.father.surnameOrigin = genderSurname[1];
          } else {
            info.father.gender = fullText[++i][5];
            info.father.surnameOrigin = fullText[++i][5];
          }
        }
      }
      if (fullText[i][5] == "모") {
        info.mother.name = "";
        info.mother.birth = "";
        info.mother.RRN = "";
        info.mother.gender = "";
        info.mother.surnameOrigin = "";
        info.mother.status = 0;
        if (fullText[i + 2][5] == '여') {
          info.mother.name = fullText[++i][5];
          info.mother.gender = fullText[++i][5];
          info.mother.status = 1;
        } else {
          if (fullText[i + 1][5].includes("사망")) {
            var data = fullText[++i][5].split("사망");
            info.mother.name = data[0];
            info.mother.birth = data[1];
            info.mother.status = 2;
          }
          else {
            info.mother.name = fullText[++i][5];
            info.mother.birth = fullText[++i][5];
            info.mother.status = 1;
          }
          info.mother.RRN = fullText[++i][5];
          if (fullText[i + 1][5].includes(' ')) {
            var genderSurname = fullText[++i].split(' ');
            info.mother.gender = genderSurname[0];
            info.mother.surnameOrigin = genderSurname[1];
          } else {
            info.mother.gender = fullText[++i][5];
            info.mother.surnameOrigin = fullText[++i][5];
          }
        }
      }
      if (fullText[i][5] == "배우자") {
        info.spouse.name = "";
        info.spouse.birth = "";
        info.spouse.RRN = "";
        info.spouse.gender = "";
        info.spouse.surnameOrigin = "";
        info.spouse.country = "";
        info.spouse.status = 1;
        if (fullText[i + 1][5].includes("기록할"))
          info.spouse.status = 0;
        else {
          if (fullText[i - 2][5] == "국적") {
            info.spouse.country = fullText[i - 1][5];
            info.spouse.status = 5;
          }
          else if (fullText[i - 1][5].includes("국적"))
            info.spouse.country = fullText[i - 1][5].split("국적 ")[1];
          else if (fullText[i - 1][5] == "국")
            info.spouse.status = 4;
          else
            info.spouse.country = "Korea";
          if (fullText[i + 1][5].includes("사망")) {
            var data = fullText[++i][5].split("사망");
            info.spouse.name = data[0];
            info.spouse.birth = data[1];
            info.spouse.status = 2;
          }
          else if (fullText[i + 1][5].includes("상실")) {
            var data = fullText[++i][5].split("상실");
            info.spouse.name = data[0];
            info.spouse.status = 3;
          }
          else {
            info.spouse.name = fullText[++i][5];
            info.spouse.birth = fullText[++i][5];
          }
          if (info.spouse.country == "Korea") {
            info.spouse.RRN = fullText[++i][5];
            if (fullText[i + 1][5].includes(' ')) {
              var genderSurname = fullText[++i][5].split(' ');
              info.spouse.gender = genderSurname[0];
              info.spouse.surnameOrigin = genderSurname[1];
            } else {
              info.spouse.gender = fullText[++i][5];
              info.spouse.surnameOrigin = fullText[++i][5];
            }
          } else {
            if (fullText[i + 1][5].includes(' ')) {
              if (info.spouse.status == 4) {
                var genderSurname = fullText[++i][5].split(' ');
                info.spouse.gender = genderSurname[0];
              } else {
                var genderSurname = fullText[++i][5].split(' ');
                info.spouse.gender = genderSurname[0];
              }
            } else {
              info.spouse.RRN = fullText[++i][5];
              info.spouse.gender = fullText[++i][5];
            }
          }
        }
      }
      if (fullText[i][5] == "자녀") {
        var name = "";
        var birth = "";
        var RRN = "";
        var gender = "";
        var surnameOrigin = "";
        var country = "Korea";
        var status = 0;
        if (fullText[i - 2][5] == "국적")
          country = fullText[i - 1][5];
        else if (fullText[i - 1][5].includes("국적"))
          country = fullText[i - 1][5].split("국적 ")[1];
        if (fullText[i + 1][5].includes("사망")) {
          var data = fullText[++i][5].split("사망");
          name = data[0];
          birth = data[1];
          status = 2;
        }
        else if (fullText[i + 1][5].includes("상실")) {
          var data = fullText[++i][5].split("상실");
          name = data[0];
          birth = data[1];
          status = 3;
        }
        else {
          name = fullText[++i][5];
          birth = fullText[++i][5];
          status = 1;
        }
        RRN = fullText[++i][5];
        if (fullText[i + 1][5].includes(' ')) {
          var genderSurname = fullText[++i][5].split(' ');
          gender = genderSurname[0];
          surnameOrigin = genderSurname[1];
        } else {
          gender = fullText[++i][5];
          if (fullText[i + 1][5] != "자녀" && !fullText[i + 1][5].includes("가족"))
            surnameOrigin = fullText[++i][5];
        }
        info.child[childCount++] = {
          name: name,
          birth: birth,
          RRN: RRN,
          gender: gender,
          surnameOrigin: surnameOrigin,
          country: country,
          status: status
        }
      }
      if (fullText[i][5] == "상 세 내 용" || fullText[i][5] == "상세 내 용" || fullText[i][5] == "상 세내 용" || fullText[i][5] == "상 세 내용" || fullText[i][5] == "상 세내용") {
        info.detail = [{
          category: null,
          content: []
        }]
        var categoryCount = 0;
        var contentCount = 0;
        var detailCategoryBBOX = 0;
        for (++i; !fullText[i][5].includes("가족관계등록부의 기록사항"); i++) {
          if (fullText[i][5].includes("기록할")) {
            info.detail = null;
            break;
          }
          if (fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10)
            info.detail[categoryCount - 1].content[contentCount++] = fullText[i][5];
          else if (!fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10 && detailCategoryBBOX != 0)
            info.detail[categoryCount - 1].content[contentCount - 1] += " " + fullText[i][5];
          else {
            console.log(fullText[i][5])
            console.log(fullText[i + 1][5])
            info.detail[categoryCount].category = null;
            info.detail[categoryCount].category = fullText[i][5];
            detailCategoryBBOX = fullText[i][0][0];
            categoryCount++;
            contentCount = 0;
          }
        }
      }
      if (fullText[i][5].includes('가족관계등록부의 기록사항')) {
        info.text1 = fullText[i++][5];
        if (Math.abs(fullText[i - 1][0][1] - fullText[i][0][1]) < 10)
          i++;
        info.dateIssue = fullText[i++][5];
        if (Math.abs(fullText[i][0][1] - fullText[i + 1][0][1]) < 10)
          info.agencyIssue = fullText[i++][5] + " " + fullText[i++][5];
        else
          info.agencyIssue = fullText[i++][5];
        info.text2 = fullText[i][5] + " " + fullText[++i][5];
      }
      if (fullText[i][5].includes('발급시각'))
        info.timeIssue = fullText[i++][5].replace('발급시각 : ', '');
      if (fullText[i][5].includes('발급담당자'))
        info.issuer = fullText[i++][5].replace('발급담당자 : ', '');
      if (fullText[i][5].includes('-')) {
        info.number = fullText[i+1][5].replace('8 : ', '');
        info.number = info.number.replace('6 : ', '');
      }
      if (fullText[i][5].includes('신청인'))
        info.applicant = fullText[i++][5].replace('신청인 : ', '');
    }
    return info;
  }




  async fmailyTranslate(data, language, documentId, Dtype, reload) { //함수 인자로 사람
    //고정값 변수값 나누기 위한 옵젝
    console.log(data);
    let defaultData = {
      address: data.address,
      addressTitle: "", category: "",
      details: "",
      name: "", dateOfBirth: "", residentNO: "", gender: "", surnameOrigin: "", RPR: "", principalTitle: "", spouseTitle: "", fatherTitle: "", motherTitle: "", childTitle: "", titleIssuer: "", titleNumber: "", titleApplicant: "", titleTimeIssue: "", lost: "", deceased: "", nationality: ""
    };
    const date = ["Jan. ", "Feb. ", "Mar. ", "Apr. ", "May. ", "Jun. ", "Jul. ", "Aug. ", "Sept. ", "Oct. ", "Nov. ", "Dec. "]
    //번역 API를 통한 주소 번역
    if (Dtype == "")
      data.type = "";
    try {
      //문서 제목
      var type = "";
      if (data.documentTitle.includes("상")) type = "(상세)";
      else if (data.documentTitle.includes("출")) type = "(특정- 출생 ∙ 사망 ∙ 실종)";
      else if (data.documentTitle.includes("친")) type = "(특정 - 친권 ∙ 후견)";
      else if (data.documentTitle.includes("일")) type = "(일반)";
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["가족관계증명서", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        data.documentTitle = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [type, "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        data.documentType = result[0][language];
      //기본값
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["등록기준지", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.addressTitle = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["구분", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.category = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["상세내용", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.details = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["성명", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.name = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["출생연월일", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.dateOfBirth = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["주민등록번호", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.residentNO = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["성별", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.gender = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["본", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.surnameOrigin = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["가족사항", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.RPR = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["사망", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.deceased = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["국적상실", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.lost = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["국적", "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.nationality = result[0][language];
      //변수값
      //주소
      try {
        await axios({
          method: 'GET',
          url: `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIzMDgwODEwMTIxMjExMzk5ODA=&currentPage=1&countPerPage=10&resultType=JSON&keyword=${data.address}`,
          headers: {},
        }).then(res => {
          data.address = res.data.results.juso[0].engAddr + ", Republic of Korea";
          return
        })
          .catch(err => {
            //console.log(err);
            return
          })
      } catch {
        console.log('axios error');
        return
      }
    } catch (err) {
      console.log(err)
    }
    //본인
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "본인" and document = "가족관계증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.principalTitle = result[0][language];
    //이름
    //생일
    if (data.principal.birth.length < 15 && data.principal.birth.charCodeAt(0) > 91 || 64 > data.principal.birth[0].charCodeAt(0))
      data.principal.birth = date[Number(data.principal.birth.substr(6, 2)) - 1] + data.principal.birth.substr(10, 2) + ", " + data.principal.birth.substr(0, 4);
    else if (data.principal.birth[0].charCodeAt(0) > 91 || 64 > data.principal.birth[0].charCodeAt(0))
      data.principal.birth = date[Number(data.principal.birth.substr(6, 2)) - 1] + data.principal.birth.substr(10, 2) + ", " + data.principal.birth.substr(0, 4) + " " + data.principal.birth.substr(14, 2) + ":" + data.principal.birth.substr(18, 2) + ":" + data.principal.birth.substr(22, 2);
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [data.principal.gender, "가족관계증명서"]);
    result = result[0];
    if (result.length > 0)
      data.principal.gender = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_surnameOrigin where cn = ?`, [data.principal.surnameOrigin]);
    result = result[0];
    if (result.length > 0)
      data.principal.surnameOrigin = result[0][language];

    //부
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "부" and document = "가족관계증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.fatherTitle = result[0][language];
    //이름
    //생일
    if (data.father.status != 0) {
      if (data.father.birth != "") {
        if (data.father.birth.length < 15 && data.father.birth.charCodeAt(0) > 91 || 64 > data.father.birth[0].charCodeAt(0))
          data.father.birth = date[Number(data.father.birth.substr(6, 2)) - 1] + data.father.birth.substr(10, 2) + ", " + data.father.birth.substr(0, 4);
        else if (data.father.birth[0].charCodeAt(0) > 91 || 64 > data.father.birth[0].charCodeAt(0))
          data.father.birth = date[Number(data.father.birth.substr(6, 2)) - 1] + data.father.birth.substr(10, 2) + ", " + data.father.birth.substr(0, 4) + " " + data.father.birth.substr(14, 2) + ":" + data.father.birth.substr(18, 2) + ":" + data.father.birth.substr(22, 2);
      }
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.father.gender}" and document = "가족관계증명서"`);
      result = result[0];
      if (result.length > 0)
        data.father.gender = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_surnameOrigin where cn = "${data.father.surnameOrigin}"`);
      result = result[0];
      if (result.length > 0)
        data.father.surnameOrigin = result[0][language];
    }

    //모
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "모" and document = "가족관계증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.motherTitle = result[0][language];
    //이름
    //생일
    if (data.mother.status != 0) {
      if (data.mother.birth != "") {
        if (data.mother.birth.length < 15 && data.mother.birth.charCodeAt(0) > 91 || 64 > data.mother.birth[0].charCodeAt(0))
          data.mother.birth = date[Number(data.mother.birth.substr(6, 2)) - 1] + data.mother.birth.substr(10, 2) + ", " + data.mother.birth.substr(0, 4);
        else if ((data.mother.birth[0].charCodeAt(0) > 91 || 64 > data.mother.birth[0].charCodeAt(0)) && data.mother.birth != "")
          data.mother.birth = date[Number(data.mother.birth.substr(6, 2)) - 1] + data.mother.birth.substr(10, 2) + ", " + data.mother.birth.substr(0, 4) + " " + data.mother.birth.substr(14, 2) + ":" + data.mother.birth.substr(18, 2) + ":" + data.mother.birth.substr(22, 2);
      }
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.mother.gender}" and document = "가족관계증명서"`);
      result = result[0];
      if (result.length > 0)
        data.mother.gender = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_surnameOrigin where cn = "${data.mother.surnameOrigin}"`);
      result = result[0];
      if (result.length > 0)
        data.mother.surnameOrigin = result[0][language];
    }
    //배우자
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["배우자", "가족관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.spouseTitle = result[0][language];
    //이름
    //생일
    if (data.spouse.status != 0) {
      if (data.spouse.birth.length < 15 && data.spouse.birth.charCodeAt(0) > 91 || 64 > data.spouse.birth[0].charCodeAt(0))
        data.spouse.birth = date[Number(data.spouse.birth.substr(6, 2)) - 1] + data.spouse.birth.substr(10, 2) + ", " + data.spouse.birth.substr(0, 4);
      else if (data.spouse.birth[0].charCodeAt(0) > 91 || 64 > data.spouse.birth[0].charCodeAt(0))
        data.spouse.birth = date[Number(data.spouse.birth.substr(6, 2)) - 1] + data.spouse.birth.substr(10, 2) + ", " + data.spouse.birth.substr(0, 4) + " " + data.spouse.birth.substr(14, 2) + ":" + data.Spouse.birth.substr(18, 2) + ":" + data.Spouse.birth.substr(22, 2);
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [data.spouse.gender, "가족관계증명서"]);
      result = result[0];
      if (result.length > 0)
        data.spouse.gender = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_surnameOrigin where cn = ?`, [data.spouse.surnameOrigin]);
      result = result[0];
      if (result.length > 0)
        data.spouse.surnameOrigin = result[0][language];
    }
    //자녀
    for (var i = 0; i < data.child.length; i++) {
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "자녀" and document = "가족관계증명서"`);
      result = result[0];
      if (result.length > 0)
        defaultData.childTitle = result[0][language];
      //이름
      //생일
      if (data.child[i].birth.length < 15 && data.child[i].birth.charCodeAt(0) > 91 || 64 > data.child[i].birth[0].charCodeAt(0))
        data.child[i].birth = date[Number(data.child[i].birth.substr(6, 2)) - 1] + data.child[i].birth.substr(10, 2) + ", " + data.child[i].birth.substr(0, 4);
      else if (data.child[i].birth[0].charCodeAt(0) > 91 || 64 > data.child[i].birth[0].charCodeAt(0))
        data.child[i].birth = date[Number(data.child[i].birth.substr(6, 2)) - 1] + data.child[i].birth.substr(10, 2) + ", " + data.child[i].birth.substr(0, 4) + " " + data.child[i].birth.substr(14, 2) + ":" + data.child[i].birth.substr(18, 2) + ":" + data.child[i].birth.substr(22, 2);
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.child[i].gender}" and document = "가족관계증명서"`);
      result = result[0];
      if (result.length > 0)
        data.child[i].gender = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_surnameOrigin where cn = "${data.child[i].surnameOrigin}"`);
      result = result[0];
      if (result.length > 0)
        data.child[i].surnameOrigin = result[0][language];
    }
    //상세
    const levenshtein = require('js-levenshtein');
    if (data.detail !== null) {
      if(!reload)
        data.detail.length = data.detail.length-1;
      for (var i = 0; i < data.detail.length; i++) {
        //상세내용 category
        var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [data.detail[i].category, "가족관계증명서"]);
        result = result[0];
        if (result.length > 0)
          data.detail[i].category = result[0][language];

        //상세내용 detail
        for (var j = 0; j < data.detail[i].content.length; j++) {
          var result: any = await this.mysql.connectionPool.execute(`SELECT ${language}, input FROM test_GIGAHON where ko like ? and document = ?`, [data.detail[i].content[j].split(' ')[0] + "%", "가족관계증명서"]);
          result = result[0];
          if (result.length > 0) {
            var location = 0;
            var CheckLevensData = 0;
            var minLevensData = 100;
            for (var k = 0; k < result.length; k++) {
              CheckLevensData = levenshtein(data.detail[i].content[j], result[k][language]);
              if (CheckLevensData < minLevensData) {
                location = k;
                minLevensData = CheckLevensData;
              }
            }
            if (result[location].input.includes("날짜")) {
              if((result[location][language].split("날짜").length - 1) === 0){
                var dateData = data.detail[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detail[i].content[j] = result[location][language] + " " + dateContent;
              }else if((result[location][language].split("날짜").length - 1) === 1){
                var dateData = data.detail[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detail[i].content[j] = result[location][language].replace('<날짜>', dateContent);
              }else if ((result[location][language].split("날짜").length - 1) === 2){
                var numberAll = data.detail[i].content[j].replace(/[^0-9]/g, "");
                let dateContent = date[Number(numberAll.substring(4, 6)) - 1] + numberAll.substring(6, 8) + ", " + numberAll.substring(0, 4);
                let dateContent2 = date[Number(numberAll.substring(12, 14)) - 1] + numberAll.substring(14, 16) + ", " + numberAll.substring(8, 12);
                data.detail[i].content[j] = result[location][language].replace('<날짜1>', dateContent).replace('<날짜2>', dateContent2);
              }
            }
            else if (result[location].input.includes("이름") || result[location].input.includes("성명")) {
              if((result[location][language].split("이름").length - 1) === 0 && (result[location][language].split("성명").length - 1) === 0){
                var nameData = data.detail[i].content[j].split(" ");
                data.detail[i].content[j] = result[location][language] + " " + nameData[1];
              }
              else data.detail[i].content[j] = result[location][language];
            }
            else if (result[location].input.includes("주민번호")) {
              if((result[location][language].split("주민번호").length - 1) === 0){
                var RRNData = data.detail[i].content[j].split(" ")[1];
                data.detail[i].content[j] = result[location][language] + " " + RRNData;
              }else if ((result[location][language].split("주민번호").length - 1) === 1){
                var RRNData = data.detail[i].content[j].replace(/[\d-]/g, "");
                data.detail[i].content[j] = result[location][language].replace('<주민번호>', RRNData);
              }else if ((result[location][language].split("주민번호").length - 1) === 2){
                var RRNAll = data.detail[i].content[j].replace(/[\d-]/g, "");
                var RRNData = RRNAll.substring(0, 14);
                var RRNData1 = RRNAll.substring(14);
                data.detail[i].content[j] = result[location][language].replace('<주민번호1>', RRNData).replace('<주민번호2>', RRNData1);
              }
            }
            else if(result[location].input.includes("주소")){
              if((result[location][language].split("주소").length - 1) === 0){
                let detailContent = this.translateAddress(data.detail[i].content[j].split("]")[1]);
                data.detail[i].content[j] = result[location][language] + " " + detailContent;
              }else if((result[location][language].split("주소").length - 1) === 1){
                let detailContent = data.detail[i].content[j].split("]")[1];
                data.detail[i].content[j] = result[location][language].replace('<주소>',detailContent);
              }else if((result[location][language].split("주소").length - 1) === 2){
                let detailContent;
                detailContent = this.translateAddress(data.detail[i].content[j]);
                detailContent[0] = this.translateAddress(detailContent[0]);
                detailContent[1] = this.translateAddress(detailContent[1]);
                data.detail[i].content[j] = result[location][language].replace('<주소1>',detailContent[0]).replace('<주소2>',detailContent[1]);
              }
            }
            else data.detail[i].content[j] = result[location][language];
          }
        }
      }
    }
    //아래 내용들
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.text1}" and document = "가족관계증명서"`);
    result = result[0];
    if (result.length > 0)
      data.text1 = result[0][language];
    if (!reload)
      data.dateIssue = date[Number(data.dateIssue.substr(6, 2)) - 1] + data.dateIssue.substr(10, 2) + ", " + data.dateIssue.substr(0, 4);


    if (data.closure != "") {
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "[폐쇄]" and document = "가족관계증명서"`);
      result = result[0];
      if (result.length > 0)
        data.closure = result[0][language];
    }
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ?`, [data.diplomaticMA]);
    result = result[0];
    if (result.length > 0)
      data.diplomaticMA = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["발급담당자", "가족관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleIssuer = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["☏", "가족관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleNumber = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["발급시각", "가족관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleTimeIssue = result[0][language];
    if (!reload)
      data.timeIssue = data.timeIssue.substr(0, 2) + ":" + data.timeIssue.substr(4, 2);
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["신청인", "가족관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleApplicant = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ?`, [data.text2]);
    result = result[0];
    if (result.length > 0)
      data.text2 = result[0][language];

    if (data.agencyIssue.includes("무인증명서")) {
      data.type = "무인";
    } else if (data.agencyIssue.includes("전산정보")) {
      data.type = "전산정보";
      var agencyName = data.agencyIssue.slice(-3);
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[0]}"`);
      result = result[0];
      data.agencyIssue = result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[1]}"`);
      result = result[0];
      data.agencyIssue += ", " + result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[2]}"`);
      result = result[0];
      data.agencyIssue += result[0].spelling.split("|")[0];
      data.agencyIssue += `, System Operation Officer
  Judicial Information Technology Center, National Court Administration`
    } else if (data.diplomaticMA.includes("[") || data.diplomaticMA.includes("]")) {
      data.type = "재외공관"
    } else if (data.type == "") {//지자체
      data.type = "지자체";
      var place = data.agencyIssue.split("장 ")[0];
      var agencyName = data.agencyIssue.split("장 ")[1];
      agencyName = agencyName.slice(-3);
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[0]}"`);
      result = result[0];
      data.agencyIssue = result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[1]}"`);
      result = result[0];
      data.agencyIssue += ", " + result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[2]}"`);
      result = result[0];
      data.agencyIssue += result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_city where ko = "${place}"`);
      result = result[0];
      if (result.length > 0) {
        data.agencyIssue += ", Head of " + result[0][language];
        data.footerAgency = "Head of " + result[0][language];
      }
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "(수입증지가 인영이 되지 아니한 증명은 그 효력을 보증할 수 없습니다.)" and document = "가족관계증명서"`);
      result = result[0];
      if (result.length > 0)
        data.stamp2 += result[0][language];
      //엑셀 값 데이터 넣기
    }
    let results = {
      documentId: documentId,
      input: data,
      default: defaultData,
    }
    // dynamodb에 results 저장
    var status = 0;
    var result: any = await this.mysql.connectionPool.execute(`SELECT d_status FROM documentType where d_title = ?`, [data.documentTitle]);
    result = result[0];
    if (result.length > 0)
      status = result[0].d_status;

    return status
  }


  async basicDocument(fullText) {
    console.log(fullText);
    var detailCount = 0;
    const info = {
      address: "",
      documentTitle: fullText[1][5],
      principal: { name: "", birth: "", gender: "", RRN: "", surnameOrigin: "" },
      detailUp: [{ category: null, content: [] }] || null,
      detailDown: [{ category: null, content: [] }] || null,
      closure: "",
      dateIssue: "",
      agencyIssue: "",
      applicant: "",
      timeIssue: "",
      issuer: "",
      number: "",
      diplomaticMA: "",
      text1: "",
      text2: ""
    };
    for (var i = 0; i < fullText.length; i++) {
      if (fullText[i][5] == "등록기준지") {
        if (fullText[i - 1][5] == "폐쇄")
          info.closure = fullText[i - 1][5];
        if (fullText[i - 2][5].startsWith('[') && fullText[i - 2][5].endsWith(']'))
          info.diplomaticMA = fullText[i - 2][5];
        info.address = fullText[++i][5];
      }
      if ((fullText[i][5] == "상 세 내 용" || fullText[i][5] == "상세 내 용" || fullText[i][5] == "상 세내 용" || fullText[i][5] == "상 세 내용" || fullText[i][5] == "상 세내용") && detailCount == 0 && info.principal.name == "") { //위 상세내용
        var categoryCount = 0;
        var contentCount = 0;
        var detailCategoryBBOX = 0;
        for (++i; !fullText[i][5].includes("구분"); i++) {
          if (fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10)
            info.detailUp[categoryCount - 1].content[contentCount++] = fullText[i][5];
          else if (!fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10 && detailCategoryBBOX != 0)
            info.detailUp[categoryCount - 1].content[contentCount - 1] += " " + fullText[i][5];
          else {
            info.detailUp = [...info.detailUp, {category : "", content : []}]
            info.detailUp[categoryCount].category = fullText[i][5];
            detailCategoryBBOX = fullText[i][0][0];
            categoryCount++;
            contentCount = 0;
          }
        }
        detailCount = 1;
      } else if ((fullText[i][5] == "상 세 내 용" || fullText[i][5] == "상세 내 용" || fullText[i][5] == "상 세내 용" || fullText[i][5] == "상 세 내용" || fullText[i][5] == "상 세내용") && info.detailUp[0].category != 0) { //아래 상세내용
        if (detailCount == 0)
          info.detailUp = null;
        var categoryCount = 0;
        var contentCount = 0;
        var detailCategoryBBOX = 0;
        for (++i; !fullText[i][5].includes("가족관계등록부의 기록사항"); i++) {
          if (fullText[i][5].includes("기록할")) {
            info.detailDown = null;
            break;
          }
          if (fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10)
            info.detailDown[categoryCount - 1].content[contentCount++] = fullText[i][5];
          else if (!fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10 && detailCategoryBBOX != 0)
            info.detailDown[categoryCount - 1].content[contentCount - 1] += " " + fullText[i][5];
          else {
            info.detailDown = [...info.detailDown, {category : "", content : []}]
            info.detailDown[categoryCount].category = fullText[i][5];
            detailCategoryBBOX = fullText[i][0][0];
            categoryCount++;
            contentCount = 0;
          }
        }
      }
      if (fullText[i][5] == "본인") {
        info.principal.name = fullText[++i][5];
        info.principal.birth = fullText[++i][5];
        info.principal.RRN = fullText[++i][5];
        if (fullText[i + 1][5].includes(' ')) {
          var genderSurname = fullText[++i][5].split(' ');
          info.principal.gender = genderSurname[0];
          info.principal.surnameOrigin = genderSurname[1];
        } else {
          info.principal.gender = fullText[++i][5];
          if (!fullText[i + 1][5].includes('일반등록사항'))
            info.principal.surnameOrigin = fullText[++i][5];
        }
      }
      if (fullText[i][5].includes('가족관계등록부의 기록사항')) {
        info.text1 = fullText[i++][5];
        if (Math.abs(fullText[i - 1][0][1] - fullText[i][0][1]) < 10)
          i++;
        if(Math.abs(fullText[i][0][0]) < 300)
          i++;
        info.dateIssue = fullText[i++][5];
        if (Math.abs(fullText[i][0][1] - fullText[i + 1][0][1]) < 10)
          info.agencyIssue = fullText[i++][5] + " " + fullText[i++][5];
        else
          info.agencyIssue = fullText[i++][5];
        info.text2 = fullText[i][5] + " " + fullText[++i][5];
      }
      if (fullText[i][5].includes('발급시각'))
        info.timeIssue = fullText[i++][5].replace('발급시각 : ', '');
      if (fullText[i][5].includes('발급담당자'))
        info.issuer = fullText[i++][5].replace('발급담당자 : ', '');
      else if (fullText[i][5].includes('-')) {
        info.number = fullText[i+1][5].replace('8 : ', '');
        info.number = info.number.replace('6 : ', '');
      }
      if (fullText[i][5].includes('신청인'))
        info.applicant = fullText[i++][5].replace('신청인 : ', '');
    }
    return info
  }

  async basicTranslate(data, language, documentId, Dtype, reload) { //함수 인자로 사람
    console.log(data)
    let defaultData = {
      addressTitle: "", category: "", details: "", name: "", dateOfBirth: "", residentNO: "", gender: "", surnameOrigin: "", RPR: "", principalTitle: "", titleIssuer: "", titleNumber: "", titleApplicant: "", titleTimeIssue: "", lost: "", deceased: "", nationality: ""
    };
    if (Dtype == "")
      data.type = "";
    const date = ["Jan. ", "Feb. ", "Mar. ", "Apr. ", "May. ", "Jun. ", "Jul. ", "Aug. ", "Sept. ", "Oct. ", "Nov. ", "Dec. "]
    //번역 API를 통한 주소 번역
    try {
      //문서 제목
      var type = "";
      if (data.documentTitle.includes("상")) type = "(상세)";
      else if (data.documentTitle.includes("출")) type = "(특정- 출생 ∙ 사망 ∙ 실종)";
      else if (data.documentTitle.includes("친")) type = "(특정 - 친권 ∙ 후견)";
      else if (data.documentTitle.includes("일")) type = "(일반)";
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "기본증명서" and document = "기본증명서"`);
      result = result[0];
      if (result.length > 0)
        data.documentTitle = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${type}" and document = "기본증명서"`);
      result = result[0];
      console.log(result);
      if (result.length > 0)
        data.documentType = result[0][language];
      //기본값
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["등록기준지", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.addressTitle = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["구분", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.category = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["상세내용", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.details = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["성명", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.name = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["출생연월일", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.dateOfBirth = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["주민등록번호", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.residentNO = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["성별", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.gender = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["본", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.surnameOrigin = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["일반등록사항", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.RPR = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["사망", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.deceased = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["국적상실", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.lost = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["국적", "기본증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.nationality = result[0][language];


      try {
        await axios({
          method: 'GET',
          url: `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIzMDgwODEwMTIxMjExMzk5ODA=&currentPage=1&countPerPage=10&resultType=JSON&keyword=${data.address}`,
          headers: {},
        }).then(res => {
          data.address = res.data.results.juso[0].engAddr + ", Republic of Korea";
          return
        })
          .catch(err => {
            console.log(err);
            return
          })
      } catch {
        console.log('axios error');
        return
      }
    } catch (err) {
      console.log(err)
    }
    //상세상 
    if (data.detailUp !== null) {
      if(!reload)
        data.detailUp.length = data.detailUp.length-1;
      for (var i = 0; i < data.detailUp.length; i++) {
        //상세내용 category
        var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.detailUp[i].category}" and document = "기본증명서"`);
        result = result[0];
        if (result.length > 0)
          data.detailUp[i].category = result[0][language];

        //상세내용 detail
        for (var j = 0; j < data.detailUp[i].content.length; j++) {
          var result: any = await this.mysql.connectionPool.execute(`SELECT ${language}, input FROM test_GIGAHON where ko like "${data.detailUp[i].content[j].split(' ')[0]}%" and document = "기본증명서"`);
          result = result[0];
          if (result.length > 0) {
            var location = 0;
            var CheckLevensData = 0;
            var minLevensData = 100;
            for (var k = 0; k < result.length; k++) {
              CheckLevensData = levenshtein(data.detailUp[i].content[j], result[k][language]);
              if (CheckLevensData < minLevensData) {
                location = k;
                minLevensData = CheckLevensData;
              }
            }
            if (result[location].input.includes("날짜")) {
              if((result[location][language].split("날짜").length - 1) === 0){
                var dateData = data.detailUp[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detailUp[i].content[j] = result[location][language] + " " + dateContent;
              }else if((result[location][language].split("날짜").length - 1) === 1){
                var dateData = data.detailUp[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detailUp[i].content[j] = result[location][language].replace('<날짜>', dateContent);
              }else if ((result[location][language].split("날짜").length - 1) === 2){
                var numberAll = data.detailUp[i].content[j].replace(/[^0-9]/g, "");
                let dateContent = date[Number(numberAll.substring(4, 6)) - 1] + numberAll.substring(6, 8) + ", " + numberAll.substring(0, 4);
                let dateContent2 = date[Number(numberAll.substring(12, 14)) - 1] + numberAll.substring(14, 16) + ", " + numberAll.substring(8, 12);
                data.detailUp[i].content[j] = result[location][language].replace('<날짜1>', dateContent).replace('<날짜2>', dateContent2);
              }
            }
            else if (result[location].input.includes("이름") || result[location].input.includes("성명")) {
              if((result[location][language].split("이름").length - 1) === 0 && (result[location][language].split("성명").length - 1) === 0){
                var nameData = data.detailUp[i].content[j].split(" ");
                data.detailUp[i].content[j] = result[location][language] + " " + nameData[1];
              }
              else data.detailUp[i].content[j] = result[location][language];
            }
            else if (result[location].input.includes("주민번호")) {
              if((result[location][language].split("주민번호").length - 1) === 0){
                var RRNData = data.detailUp[i].content[j].split(" ")[1];
                data.detailUp[i].content[j] = result[location][language] + " " + RRNData;
              }else if ((result[location][language].split("주민번호").length - 1) === 1){
                var RRNData = data.detailUp[i].content[j].replace(/[\d-]/g, "");
                data.detailUp[i].content[j] = result[location][language].replace('<주민번호>', RRNData);
              }else if ((result[location][language].split("주민번호").length - 1) === 2){
                var RRNAll = data.detailUp[i].content[j].replace(/[\d-]/g, "");
                var RRNData = RRNAll.substring(0, 14);
                var RRNData1 = RRNAll.substring(14);
                data.detailUp[i].content[j] = result[location][language].replace('<주민번호1>', RRNData).replace('<주민번호2>', RRNData1);
              }
            }
            else if(result[location].input.includes("주소")){
              if((result[location][language].split("주소").length - 1) === 0){
                let detailContent = this.translateAddress(data.detailUp[i].content[j].split("]")[1]);
                data.detailUp[i].content[j] = result[location][language] + " " + detailContent;
              }else if((result[location][language].split("주소").length - 1) === 1){
                let detailContent = data.detailUp[i].content[j].split("]")[1];
                data.detailUp[i].content[j] = result[location][language].replace('<주소>',detailContent);
              }else if((result[location][language].split("주소").length - 1) === 2){
                let detailContent;
                detailContent = this.translateAddress(data.detailUp[i].content[j]);
                detailContent[0] = this.translateAddress(detailContent[0]);
                detailContent[1] = this.translateAddress(detailContent[1]);
                data.detailUp[i].content[j] = result[location][language].replace('<주소1>',detailContent[0]).replace('<주소2>',detailContent[1]);
              }
            }
            else data.detailUp[i].content[j] = result[location][language];
          }
        }
      }
    }
    //본인
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "본인" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.principalTitle = result[0][language];
    //이름
    //생일
    if (data.principal.birth.length < 15 && data.principal.birth.charCodeAt(0) > 91 || 64 > data.principal.birth[0].charCodeAt(0))
      data.principal.birth = date[Number(data.principal.birth.substr(6, 2)) - 1] + data.principal.birth.substr(10, 2) + ", " + data.principal.birth.substr(0, 4);
    else if (data.principal.birth[0].charCodeAt(0) > 91 || 64 > data.principal.birth[0].charCodeAt(0))
      data.principal.birth = date[Number(data.principal.birth.substr(6, 2)) - 1] + data.principal.birth.substr(10, 2) + ", " + data.principal.birth.substr(0, 4) + " " + data.principal.birth.substr(14, 2) + ":" + data.principal.birth.substr(18, 2) + ":" + data.principal.birth.substr(22, 2);
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.principal.gender}" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      data.principal.gender = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.principal.surnameOrigin}" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      data.principal.surnameOrigin = result[0][language];
    //상세하
    if (data.detailDown !== null) {
      if(!reload)
        data.detailDown.length = data.detailDown.length-1;
      for (var i = 0; i < data.detailDown.length; i++) {
        //상세내용 category
        var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.detailDown[i].category}" and document = "기본증명서"`);
        result = result[0];
        if (result.length > 0)
          data.detailDown[i].category = result[0][language];

        //상세내용 detail
        for (var j = 0; j < data.detailDown[i].content.length; j++) {
          var result: any = await this.mysql.connectionPool.execute(`SELECT ${language}, input FROM test_GIGAHON where ko like "${data.detailDown[i].content[j].split(' ')[0]}%" and document = "기본증명서"`);
          result = result[0];
          if (result.length > 0) {
            var location = 0;
            var CheckLevensData = 0;
            var minLevensData = 100;
            for (var k = 0; k < result.length; k++) {
              CheckLevensData = levenshtein(data.detailDown[i].content[j], result[k][language]);
              if (CheckLevensData < minLevensData) {
                location = k;
                minLevensData = CheckLevensData;
              }
            }
            if (result[location].input.includes("날짜")) {
              if((result[location][language].split("날짜").length - 1) === 0){
                var dateData = data.detailDown[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detailDown[i].content[j] = result[location][language] + " " + dateContent;
              }else if((result[location][language].split("날짜").length - 1) === 1){
                var dateData = data.detailDown[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detailDown[i].content[j] = result[location][language].replace('<날짜>', dateContent);
              }else if ((result[location][language].split("날짜").length - 1) === 2){
                var numberAll = data.detailDown[i].content[j].replace(/[^0-9]/g, "");
                let dateContent = date[Number(numberAll.substring(4, 6)) - 1] + numberAll.substring(6, 8) + ", " + numberAll.substring(0, 4);
                let dateContent2 = date[Number(numberAll.substring(12, 14)) - 1] + numberAll.substring(14, 16) + ", " + numberAll.substring(8, 12);
                data.detailDown[i].content[j] = result[location][language].replace('<날짜1>', dateContent).replace('<날짜2>', dateContent2);
              }
            }
            else if (result[location].input.includes("이름") || result[location].input.includes("성명")) {
              if((result[location][language].split("이름").length - 1) === 0 && (result[location][language].split("성명").length - 1) === 0){
                var nameData = data.detailDown[i].content[j].split(" ");
                data.detailDown[i].content[j] = result[location][language] + " " + nameData[1];
              }
              else data.detailDown[i].content[j] = result[location][language];
            }
            else if (result[location].input.includes("주민번호")) {
              if((result[location][language].split("주민번호").length - 1) === 0){
                var RRNData = data.detailDown[i].content[j].split(" ")[1];
                data.detailDown[i].content[j] = result[location][language] + " " + RRNData;
              }else if ((result[location][language].split("주민번호").length - 1) === 1){
                var RRNData = data.detailDown[i].content[j].replace(/[\d-]/g, "");
                data.detailDown[i].content[j] = result[location][language].replace('<주민번호>', RRNData);
              }else if ((result[location][language].split("주민번호").length - 1) === 2){
                var RRNAll = data.detailDown[i].content[j].replace(/[\d-]/g, "");
                var RRNData = RRNAll.substring(0, 14);
                var RRNData1 = RRNAll.substring(14);
                data.detailDown[i].content[j] = result[location][language].replace('<주민번호1>', RRNData).replace('<주민번호2>', RRNData1);
              }
            }
            else if(result[location].input.includes("주소")){
              if((result[location][language].split("주소").length - 1) === 0){
                let detailContent = this.translateAddress(data.detailDown[i].content[j].split("] ")[1]);
                data.detailDown[i].content[j] = result[location][language] + " " + detailContent;
              }else if((result[location][language].split("주소").length - 1) === 1){
                let detailContent = data.detailDown[i].content[j].split("] ")[1];
                data.detailDown[i].content[j] = result[location][language].replace('<주소>',detailContent);
              }else if((result[location][language].split("주소").length - 1) === 2){
                let detailContent;
                detailContent = this.getKoreanAddressInString(data.detailDown[i].content[j]);
                detailContent[0] = this.translateAddress(detailContent[0]);
                detailContent[1] = this.translateAddress(detailContent[1]);
                data.detailDown[i].content[j] = result[location][language].replace('<주소1>',detailContent[0]).replace('<주소2>',detailContent[1]);
              }
            }
            else data.detailDown[i].content[j] = result[location][language];
          }
        }
      }
    }
    //아래 내용들
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.text1}" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      data.text1 = result[0][language];
    if (!reload)
      data.dateIssue = date[Number(data.dateIssue.substr(6, 2)) - 1] + data.dateIssue.substr(10, 2) + ", " + data.dateIssue.substr(0, 4);



    if (data.closure != "") {
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "[폐쇄]" and document = "기본증명서"`);
      result = result[0];
      if (result.length > 0)
        data.closure = result[0][language];
    }
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.diplomaticMA}"`);
    result = result[0];
    if (result.length > 0)
      data.diplomaticMA = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "발급담당자" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.titleIssuer = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "☏" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.titleNumber = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "발급시각" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.titleTimeIssue = result[0][language];
    data.timeIssue = data.timeIssue.substr(0, 2) + ":" + data.timeIssue.substr(4, 2);
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "신청인" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      defaultData.titleApplicant = result[0][language];
    data.timeIssue = data.timeIssue.substr(0, 2) + ":" + data.timeIssue.substr(4, 2);
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "${data.text2}" and document = "기본증명서"`);
    result = result[0];
    if (result.length > 0)
      data.text2 = result[0][language];

    if (data.agencyIssue.includes("무인증명서")) {
      data.type = "무인";
    } else if (data.agencyIssue.includes("전산정보")) {
      data.type = "전산정보";
      var agencyName = data.agencyIssue.slice(-3);
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[0]}"`);
      result = result[0];
      data.agencyIssue = result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[1]}"`);
      result = result[0];
      data.agencyIssue += ", " + result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[2]}"`);
      result = result[0];
      data.agencyIssue += result[0].spelling.split("|")[0];
      data.agencyIssue += `, System Operation Officer, 
  Judicial Information Technology Center National Court Administration`
    } else if (data.diplomaticMA.includes("[") || data.diplomaticMA.includes("]")) {
      data.type = "재외공관"
    } else if (data.type == "") {//지자체
      data.type = "지자체";
      var place = data.agencyIssue.split("장 ")[0];
      var agencyName = data.agencyIssue.split("장 ")[1];
      agencyName = agencyName.slice(-3);
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[0]}"`);
      result = result[0];
      data.agencyIssue = result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[1]}"`);
      result = result[0];
      data.agencyIssue += ", " + result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT spelling FROM namespelling where name = "${agencyName[2]}"`);
      result = result[0];
      data.agencyIssue += result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_city where ko = "${place}"`);
      result = result[0];
      if (result.length > 0) {
        data.agencyIssue += ", Head of " + result[0][language];
        data.footerAgency = "Head of " + result[0][language];
      }
      // var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = "(수입증지가 인영이 되지 아니한 증명은 그 효력을 보증할 수 없습니다.)" and document = "기본증명서"`);
      // result = result[0];
      // if (result.length > 0)
      //   data.stamp2 += result[0][language];
      //엑셀 값 데이터 넣기
    }
    let results = {
      documentId: documentId,
      input: data,
      default: defaultData,
    }
    console.log(data);
    console.log(defaultData);
    // dynamodb에 results 저장
    var status = 0;
    var result: any = await this.mysql.connectionPool.execute(`SELECT d_status FROM documentType where d_title = ?`, [data.documentTitle]);
    result = result[0];
    console.log(result[0])
    if (result.length > 0)
      status = result[0].d_status;

    return status
  }

  async marriagageDocument(fullText) {
    const info = {
      address: "",
      documentTitle: fullText[1][5],
      principal: { name: "", birth: "", RRN: "", gender: "", surnameOrigin: "" },
      spouse: { status: 0, name: "", birth: "", RRN: "", gender: "", surnameOrigin: "", country: "Korea" },
      detail: [{ category: "", content: [] }] || null,
      closure: "",
      diplomaticMA: "",
      dateIssue: "",
      agencyIssue: "",
      applicant: "",
      issuer: "",
      timeIssue: "",
      number: "",
      text1: "",
      text2: ""
    };
    for (var i = 0; i < fullText.length; i++) {
      if (fullText[i][5] == "등록기준지") {
        if (fullText[i - 1][5] == "폐쇄")
          info.closure = fullText[i - 1][5];
        if (fullText[i - 2][5].startsWith('[') && fullText[i - 2][5].endsWith(']'))
          info.diplomaticMA = fullText[i - 2][5];
        info.address = fullText[++i][5];
      }
      if (fullText[i][5] == "본인") {
        info.principal.name = fullText[++i][5];
        info.principal.birth = fullText[++i][5];
        info.principal.RRN = fullText[++i][5];
        if (fullText[i + 1][5].includes(' ')) {
          var genderSurname = fullText[++i][5].split(' ');
          info.principal.gender = genderSurname[0];
          info.principal.surnameOrigin = genderSurname[1];
        } else {
          info.principal.gender = fullText[++i][5];
          info.principal.surnameOrigin = fullText[++i][5];
        }
      }
      if (fullText[i][5] == "배우자") {
        info.spouse.name = "";
        info.spouse.birth = "";
        info.spouse.RRN = "";
        info.spouse.gender = "";
        info.spouse.surnameOrigin = "";
        info.spouse.country = "";
        info.spouse.status = 1;
        if (fullText[i + 1][5].includes("기록할"))
          info.spouse.status = 0;
        else {
          if (fullText[i - 2][5] == "국적") {
            info.spouse.country = fullText[i - 1][5];
            info.spouse.status = 5;
          }
          else if (fullText[i - 1][5].includes("국적"))
            info.spouse.country = fullText[i - 1][5].split("국적 ")[1];
          else if (fullText[i - 1][5] == "국")
            info.spouse.status = 4;
          else
            info.spouse.country = "Korea";
          if (fullText[i + 1][5].includes("사망")) {
            var data = fullText[++i][5].split("사망");
            info.spouse.name = data[0];
            info.spouse.birth = data[1];
            info.spouse.status = 2;
          }
          else if (fullText[i + 1][5].includes("상실")) {
            var data = fullText[++i][5].split("상실");
            info.spouse.name = data[0];
            info.spouse.status = 3;
          }
          else {
            info.spouse.name = fullText[++i][5];
            info.spouse.birth = fullText[++i][5];
          }
          if (info.spouse.country == "Korea") {
            info.spouse.RRN = fullText[++i][5];
            if (fullText[i + 1][5].includes(' ')) {
              var genderSurname = fullText[++i][5].split(' ');
              info.spouse.gender = genderSurname[0];
              info.spouse.surnameOrigin = genderSurname[1];
            } else {
              info.spouse.gender = fullText[++i][5];
              info.spouse.surnameOrigin = fullText[++i][5];
            }
          } else {
            if (fullText[i + 1][5].includes(' ')) {
              if (info.spouse.status == 4) {
                var genderSurname = fullText[++i][5].split(' ');
                info.spouse.gender = genderSurname[0];
              } else {
                var genderSurname = fullText[++i][5].split(' ');
                info.spouse.gender = genderSurname[0];
              }
            } else {
              info.spouse.gender = fullText[++i][5];
            }
            info.spouse.RRN = fullText[++i][5];
          }
        }
      }
      if (fullText[i][5] == "상 세 내 용" || fullText[i][5] == "상세 내 용" || fullText[i][5] == "상 세내 용" || fullText[i][5] == "상 세 내용" || fullText[i][5] == "상 세내용") {
        var categoryCount = 0;
        var contentCount = 0;
        var detailCategoryBBOX = 0;
        for (++i; !fullText[i][5].includes("가족관계등록부의 기록사항"); i++) {
          if (fullText[i][5].includes("기록할")) {
            info.detail = null;
            break;
          }
          if (fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10)
            info.detail[categoryCount - 1].content[contentCount++] = fullText[i][5];
          else if (!fullText[i][5].includes('[') && Math.abs(fullText[i][0][0] - detailCategoryBBOX) > 10 && detailCategoryBBOX != 0)
            info.detail[categoryCount - 1].content[contentCount - 1] += " " + fullText[i][5];
          else {
            info.detail = [...info.detail, {category : "", content : []}]
            info.detail[categoryCount].category = fullText[i][5];
            detailCategoryBBOX = fullText[i][0][0];
            categoryCount++;
            contentCount = 0;
          }
        }
      }
      if (fullText[i][5].includes('가족관계등록부의 기록사항')) {
        info.text1 = fullText[i++][5];
        if (Math.abs(fullText[i - 1][0][1] - fullText[i][0][1]) < 10)
          i++;
        info.dateIssue = fullText[i++][5];
        if (Math.abs(fullText[i][0][1] - fullText[i + 1][0][1]) < 10)
          info.agencyIssue = fullText[i++][5] + " " + fullText[i++][5];
        else
          info.agencyIssue = fullText[i++][5];
        info.text2 = fullText[i][5] + " " + fullText[++i][5];
      }
      if (fullText[i][5].includes('발급시각'))
        info.timeIssue = fullText[i++][5].replace('발급시각 : ', '');
      if (fullText[i][5].includes('발급담당자'))
        info.issuer = fullText[i++][5].replace('발급담당자 : ', '');
      if (fullText[i][5].includes('-')) {
        info.number = fullText[i+1][5].replace('8 : ', '');
        info.number = info.number.replace('6 : ', '');
      }
      if (fullText[i][5].includes('신청인'))
        info.applicant = fullText[i++][5].replace('신청인 : ', '');
    }
    console.log(info)
    return info
  }


  async marriagageTranslate(data, language, documentId, Dtype, reload) { //함수 인자로 사람
    let defaultData = {
      address: data.address,
      addressTitle: "", category: "",
      details: [{
        category: null,
        content: []
      }],
      name: "", dateOfBirth: "", residentNO: "", gender: "", surnameOrigin: "", RPR: "", principalTitle: "", spouseTitle: "", titleIssuer: "", titleNumber: "", titleApplicant: "", titleTimeIssue: "", lost: "", deceased: "", nationality: ""
    };
    if (Dtype == "")
      data.type = "";
    const date = ["Jan. ", "Feb. ", "Mar. ", "Apr. ", "May. ", "Jun. ", "Jul. ", "Aug. ", "Sept. ", "Oct. ", "Nov. ", "Dec. "]
    //번역 API를 통한 주소 번역
    try {
      //문서 제목
      var type = "";
      if (data.documentTitle.includes("상")) type = "(상세)";
      else if (data.documentTitle.includes("출")) type = "(특정- 출생 ∙ 사망 ∙ 실종)";
      else if (data.documentTitle.includes("친")) type = "(특정 - 친권 ∙ 후견)";
      else if (data.documentTitle.includes("일")) type = "(일반)";
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["혼인관계증명서", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        data.documentTitle = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [type, "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        data.documentType = result[0][language];
      //기본값
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["등록기준지", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.addressTitle = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["구분", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.category = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["상세내용", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.details = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["성명", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.name = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["출생연월일", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.dateOfBirth = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["주민등록번호", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.residentNO = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["성별", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.gender = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["본", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.surnameOrigin = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["혼인사항", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.RPR = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["사망", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.deceased = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["국적상실", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.lost = result[0][language];

      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["국적", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        defaultData.nationality = result[0][language];

      //변수값
      //주소
      try {
        await axios({
          method: 'GET',
          url: `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIzMDgwODEwMTIxMjExMzk5ODA=&currentPage=1&countPerPage=10&resultType=JSON&keyword=${data.address}`,
          headers: {},
        }).then(res => {
          data.address = res.data.results.juso[0].engAddr+ ", Republic of Korea";
          return
        })
          .catch(err => {
            console.log(err);
            return
          })
      } catch {
        console.log('axios error');
        return
      }
    } catch (err) {
      console.log(err)
    }
    //본인
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["본인", "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.principalTitle = result[0][language];
    //이름
    //생일
    if (data.principal.birth.length < 15 && data.principal.birth.charCodeAt(0) > 91 || 64 > data.principal.birth[0].charCodeAt(0))
      data.principal.birth = date[Number(data.principal.birth.substr(6, 2)) - 1] + data.principal.birth.substr(10, 2) + ", " + data.principal.birth.substr(0, 4);
    else if (data.principal.birth[0].charCodeAt(0) > 91 || 64 > data.principal.birth[0].charCodeAt(0))
      data.principal.birth = date[Number(data.principal.birth.substr(6, 2)) - 1] + data.principal.birth.substr(10, 2) + ", " + data.principal.birth.substr(0, 4) + " " + data.principal.birth.substr(14, 2) + ":" + data.principal.birth.substr(18, 2) + ":" + data.principal.birth.substr(22, 2);
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [data.principal.gender, "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      data.principal.gender = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_surnameOrigin where cn = ?`, [data.principal.surnameOrigin]);
    result = result[0];
    if (result.length > 0)
      data.principal.surnameOrigin = result[0][language];

    //배우자
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["배우자", "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.spouseTitle = result[0][language];
    //이름
    //생일
    if (data.spouse.status != 0) {
      if (data.spouse.birth.length < 15 && data.spouse.birth.charCodeAt(0) > 91 || 64 > data.spouse.birth[0].charCodeAt(0))
        data.spouse.birth = date[Number(data.spouse.birth.substr(6, 2)) - 1] + data.spouse.birth.substr(10, 2) + ", " + data.spouse.birth.substr(0, 4);
      else if (data.spouse.birth[0].charCodeAt(0) > 91 || 64 > data.spouse.birth[0].charCodeAt(0))
        data.spouse.birth = date[Number(data.spouse.birth.substr(6, 2)) - 1] + data.spouse.birth.substr(10, 2) + ", " + data.spouse.birth.substr(0, 4) + " " + data.spouse.birth.substr(14, 2) + ":" + data.Spouse.birth.substr(18, 2) + ":" + data.Spouse.birth.substr(22, 2);
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [data.spouse.gender, "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        data.spouse.gender = result[0][language];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_surnameOrigin where cn = ?`, [data.spouse.surnameOrigin]);
      result = result[0];
      if (result.length > 0)
        data.spouse.surnameOrigin = result[0][language];
    }
    //상세
    const levenshtein = require('js-levenshtein');
    if (data.detail !== null) {
      if(!reload)
        data.detail.length = data.detail.length-1;
      for (var i = 0; i < data.detail.length; i++) {
        //상세내용 category
        var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [data.detail[i].category, "혼인관계증명서"]);
        result = result[0];
        if (result.length > 0)
          data.detail[i].category = result[0][language];

        //상세내용 detail
        for (var j = 0; j < data.detail[i].content.length; j++) {
          var result: any = await this.mysql.connectionPool.execute(`SELECT ${language}, input FROM test_GIGAHON where ko like ? and document = ?`, [data.detail[i].content[j].split(' ')[0] + "%", "혼인관계증명서"]);
          result = result[0];
          if (result.length > 0) {
            var location = 0;
            var CheckLevensData = 0;
            var minLevensData = 100;
            for (var k = 0; k < result.length; k++) {
              CheckLevensData = levenshtein(data.detail[i].content[j], result[k][language]);
              if (CheckLevensData < minLevensData) {
                location = k;
                minLevensData = CheckLevensData;
              }
            }
            if (result[location].input.includes("날짜")) {
              if((result[location][language].split("날짜").length - 1) === 0){
                var dateData = data.detail[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detail[i].content[j] = result[location][language] + " " + dateContent;
              }else if((result[location][language].split("날짜").length - 1) === 1){
                var dateData = data.detail[i].content[j].split(" ");
                let dateContent = date[Number(dateData[2].substring(0, 2)) - 1] + dateData[3].substring(0, 2) + ", " + dateData[1].substring(0, 4);
                data.detail[i].content[j] = result[location][language].replace('<날짜>', dateContent);
              }else if ((result[location][language].split("날짜").length - 1) === 2){
                var numberAll = data.detail[i].content[j].replace(/[^0-9]/g, "");
                let dateContent = date[Number(numberAll.substring(4, 6)) - 1] + numberAll.substring(6, 8) + ", " + numberAll.substring(0, 4);
                let dateContent2 = date[Number(numberAll.substring(12, 14)) - 1] + numberAll.substring(14, 16) + ", " + numberAll.substring(8, 12);
                data.detail[i].content[j] = result[location][language].replace('<날짜1>', dateContent).replace('<날짜2>', dateContent2);
              }
            }
            else if (result[location].input.includes("이름") || result[location].input.includes("성명")) {
              if((result[location][language].split("이름").length - 1) === 0 && (result[location][language].split("성명").length - 1) === 0){
                var nameData = data.detail[i].content[j].split(" ");
                data.detail[i].content[j] = result[location][language] + " " + nameData[1];
              }
              else data.detail[i].content[j] = result[location][language];
            }
            else if (result[location].input.includes("주민번호")) {
              if((result[location][language].split("주민번호").length - 1) === 0){
                var RRNData = data.detail[i].content[j].split(" ")[1];
                data.detail[i].content[j] = result[location][language] + " " + RRNData;
              }else if ((result[location][language].split("주민번호").length - 1) === 1){
                var RRNData = data.detail[i].content[j].replace(/[\d-]/g, "");
                data.detail[i].content[j] = result[location][language].replace('<주민번호>', RRNData);
              }else if ((result[location][language].split("주민번호").length - 1) === 2){
                var RRNAll = data.detail[i].content[j].replace(/[\d-]/g, "");
                var RRNData = RRNAll.substring(0, 14);
                var RRNData1 = RRNAll.substring(14);
                data.detail[i].content[j] = result[location][language].replace('<주민번호1>', RRNData).replace('<주민번호2>', RRNData1);
              }
            }
            else if(result[location].input.includes("주소")){
              if((result[location][language].split("주소").length - 1) === 0){
                let detailContent = this.translateAddress(data.detail[i].content[j].split("]")[1]);
                data.detail[i].content[j] = result[location][language] + " " + detailContent;
              }else if((result[location][language].split("주소").length - 1) === 1){
                let detailContent = data.detail[i].content[j].split("]")[1];
                data.detail[i].content[j] = result[location][language].replace('<주소>',detailContent);
              }else if((result[location][language].split("주소").length - 1) === 2){
                let detailContent;
                detailContent = this.translateAddress(data.detail[i].content[j]);
                detailContent[0] = this.translateAddress(detailContent[0]);
                detailContent[1] = this.translateAddress(detailContent[1]);
                data.detail[i].content[j] = result[location][language].replace('<주소1>',detailContent[0]).replace('<주소2>',detailContent[1]);
              }
            }
            else data.detail[i].content[j] = result[location][language];
          }
        }
      }
    }
    //아래 내용들
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, [data.text1, "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      data.text1 = result[0][language];
    if (!reload)
      data.dateIssue = date[Number(data.dateIssue.substr(6, 2)) - 1] + data.dateIssue.substr(10, 2) + ", " + data.dateIssue.substr(0, 4);


    if (data.closure != "") {
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["[폐쇄]", "혼인관계증명서"]);
      result = result[0];
      if (result.length > 0)
        data.closure = result[0][language];
    }
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ?`, [data.diplomaticMA]);
    result = result[0];
    if (result.length > 0)
      data.diplomaticMA = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["발급담당자", "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleIssuer = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["☏", "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleNumber = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["발급시각", "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleTimeIssue = result[0][language];
    if (!reload)
      data.timeIssue = data.timeIssue.substr(0, 2) + ":" + data.timeIssue.substr(4, 2);
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["신청인", "혼인관계증명서"]);
    result = result[0];
    if (result.length > 0)
      defaultData.titleApplicant = result[0][language];
    var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ?`, [data.text2]);
    result = result[0];
    if (result.length > 0)
      data.text2 = result[0][language];

    if (data.agencyIssue.includes("무인증명서")) {
      data.type = "무인";
    } else if (data.agencyIssue.includes("전산정보")) {
      data.type = "전산정보";
      var agencyName = data.agencyIssue.slice(-3);
      var result: any = await this.mysql.connectionPool.execute("SELECT spelling FROM namespelling where name = ?", [agencyName[0]]);
      result = result[0];
      data.agencyIssue = result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute("SELECT spelling FROM namespelling where name = ?", [agencyName[1]]);
      result = result[0];
      data.agencyIssue += ", " + result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute("SELECT spelling FROM namespelling where name = ?", [agencyName[2]]);
      result = result[0];
      data.agencyIssue += result[0].spelling.split("|")[0];
      data.agencyIssue += `, System Operation Officer, 
  Judicial Information Technology Center National Court Administration`;
    } else if (data.diplomaticMA.includes("[") || data.diplomaticMA.includes("]")) {
      data.type = "재외공관"
    } else if (data.type == "") {//지자체
      data.type = "지자체";
      var place = data.agencyIssue.split("장 ")[0];
      var agencyName = data.agencyIssue.split("장 ")[1];
      agencyName = agencyName.slice(-3);
      var result: any = await this.mysql.connectionPool.execute("SELECT spelling FROM namespelling where name = ?", [agencyName[0]]);
      result = result[0];
      data.agencyIssue = result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute("SELECT spelling FROM namespelling where name = ?", [agencyName[1]]);
      result = result[0];
      data.agencyIssue += ", " + result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute("SELECT spelling FROM namespelling where name = ?", [agencyName[2]]);
      result = result[0];
      data.agencyIssue += result[0].spelling.split("|")[0];
      var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_city where ko = ?`, [place]);
      result = result[0];
      if (result.length > 0) {
        data.agencyIssue += ", Head of " + result[0][language];
        data.footerAgency = "Head of " + result[0][language];
      }
      // var result: any = await this.mysql.connectionPool.execute(`SELECT ${language} FROM test_GIGAHON where ko = ? and document = ?`, ["(수입증지가 인영이 되지 아니한 증명은 그 효력을 보증할 수 없습니다.)", "혼인관계증명서"]);
      // result = result[0];
      // if (result.length > 0)
      //   data.stamp2 += result[0][language];
      // //엑셀 값 데이터 넣기
    }
    let results = {
      documentId: documentId,
      input: data,
      default: defaultData,
    }
    console.log(data);
    console.log(defaultData);
    // dynamodb에 results 저장
    var status = 0;
    var result: any = await this.mysql.connectionPool.execute(`SELECT d_status FROM documentType where d_title = ?`, [data.documentTitle]);
    result = result[0];
    console.log(result[0])
    if (result.length > 0)
      status = result[0].d_status;

    return status
  }

  async wordDownload(data, status) {
    let buf;
    if (status == 2)
      buf = this.basicMakeWordDocument(data);
    else if (status == 3)
      buf = this.marriagageMakeWordDocument(data);
    else if (status == 1)
      buf = this.familyMakeWordDocument(data);
    return buf
  }



  async familyMakeWordDocument(data) {
    const PizZip = require("pizzip");
    const Docxtemplater = require("docxtemplater");
    const fs = require("fs");
    const path = require("path");
    // Load the docx file as binary content
    const content = fs.readFileSync(
      path.resolve("./wordData", `가족_${data.input.type}.docx`),
      "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    var child = [];
    for (var i = 0; i < data.input.child.length; i++) {
      child[i] = {
        "basicChild": (data.input.child[i].country == "Korea") ? true : false,
        "noRRNChild": (data.input.child[i].country == "Korea" && data.input.child[i].RRN == "") ? true : false,
        "RRNChild": (data.input.child[i].country == "Korea" && data.input.child[i].RRN != "") ? true : false,
        "hasChildLoss": (data.input.child[i].status == 3) ? true : false,
        "hasChildDead": (data.input.child[i].status == 2) ? true : false,
        childName: data.input.child[i].name,
        childBirth: data.input.child[i].birth,
        childRRN: data.input.child[i].RRN,
        childGender: data.input.child[i].gender,
        childSurnameOrigin: data.input.child[i].surnameOrigin
      }
    }
    var detail = [];
    var detailContent = "";
    for (var i = 0; i < data.input.detail.length; i++) {
      detailContent = "";
      for (var j = 0; j < data.input.detail[i].content.length; j++) {
        detailContent += data.input.detail[i].content[j] + "\n"
      }
      detail[i] = {
        category: data.input.detail[i].category,
        content: detailContent
      }
    }
    doc.render({
      title: data.input.documentTitle,
      type: data.input.documentType,
      diplomaticMA: data.input.diplomaticMA,
      "closure": data.input.closure,
      address: data.input.address,
      "hasLoss": false,
      "hasDead": false,
      "hasFatherLoss": (data.input.father.status == 3) ? true : false,
      "hasFatherDead": (data.input.father.status == 2) ? true : false,
      "hasMotherLoss": (data.input.mother.status == 3) ? true : false,
      "hasMotherDead": (data.input.mother.status == 2) ? true : false,
      "hasSpouseLoss": (data.input.spouse.status == 3) ? true : false,
      "hasSpouseDead": (data.input.spouse.status == 2) ? true : false,
      "hasSpouse": (data.input.spouse.status == 0) ? false : true,
      "hasChild": (data.input.child.length == 0) ? false : true,
      "basicSpouse": (data.input.spouse.country == "Korea") ? true : false,
      "noRRNSpouse": (data.input.spouse.country == "Korea" && data.input.spouse.RRN == "") ? true : false,
      "RRNSpouse": (data.input.spouse.country == "Korea" && data.input.spouse.RRN != "") ? true : false,
      "hasDetail": (data != null) ? true : false,
      principalName: data.input.principal.name,
      principalBirth: data.input.principal.birth,
      principalRRN: data.input.principal.RRN,
      principalGender: data.input.principal.gender,
      principalSurnameOrigin: data.input.principal.surnameOrigin,

      fatherName: data.input.father.name,
      fatherBirth: (data.input.father.birth != undefined) ? data.input.father.birth : "",
      fatherRRN: (data.input.father.RRN != undefined) ? data.input.father.RRN : "",
      fatherGender: data.input.father.gender,
      fatherSurnameOrigin: (data.input.father.surnameOrigin != undefined) ? data.input.father.surnameOrigin : "",

      motherName: data.input.mother.name,
      motherBirth: (data.input.mother.birth != undefined) ? data.input.mother.birth : "",
      motherRRN: (data.input.mother.RRN != undefined) ? data.input.mother.RRN : "",
      motherGender: data.input.mother.gender,
      motherSurnameOrigin: (data.input.mother.surnameOrigin != undefined) ? data.input.mother.surnameOrigin : "",

      spouseName: data.input.spouse.name,
      spouseBirth: data.input.spouse.birth,
      spouseRRN: data.input.spouse.RRN,
      spouseGender: data.input.spouse.gender,
      spouseSurnameOrigin: data.input.spouse.surnameOrigin,
      spouseCountry: data.input.spouse.country,

      child: child,
      dateIssue: data.input.dateIssue,
      agencyIssue: data.input.agencyIssue,
      timeIssue: data.input.timeIssue,
      applicant: data.input.applicant,
      footerAgency: data.input.footerAgency,
      stamp2: data.input.stamp2,
      text1: data.input.text1,
      text2: (data.input.text2 != "") ? data.input.text2 : `※ This certificate is the ${data.input.documentType}, which contains information pursuant to Article. 15-3 of the Act on Registration of Family Relations.`,
      detail: detail
    });
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

    return buf;
  }



  //기본증명서 word문서 생성 함수
  async basicMakeWordDocument(data) {
    const PizZip = require("pizzip");
    const Docxtemplater = require("docxtemplater");
    const fs = require("fs");
    const path = require("path");
    // Load the docx file as binary content
    const content = fs.readFileSync(
      path.resolve("./wordData", `기본_${data.input.type}.docx`),
      "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    var detailUp = [];
    var detailDown = [];
    var detailUpContent = "";
    var detailDownContent = "";
    for (var i = 0; i < data.input.detailUp.length; i++) {
      detailUpContent = "";
      for (var j = 0; j < data.input.detailUp[i].content.length; j++) {
        detailUpContent += data.input.detailUp[i].content[j] + "\n"
      }
      detailUp[i] = {
        category: data.input.detailUp[i].category,
        content: detailUpContent
      }
    }
    for (var i = 0; i < data.input.detailDown.length; i++) {
      detailDownContent = "";
      for (var j = 0; j < data.input.detailDown[i].content.length; j++) {
        detailDownContent += data.input.detailDown[i].content[j] + "\n"
      }
      detailDown[i] = {
        category: data.input.detailDown[i].category,
        content: detailDownContent
      }
    }
    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render({
      title: data.input.documentTitle,
      type: data.input.documentType,
      diplomaticMA: data.input.diplomaticMA,
      "closure": data.input.closure,
      address: data.input.address,
      "hasLoss": false,
      "hasDead": false,
      "hasUpDetail": (data.input.detailUp != null) ? true : false,
      principalName: data.input.principal.name,
      principalBirth: data.input.principal.birth,
      principalRRN: data.input.principal.RRN,
      principalGender: data.input.principal.gender,
      principalSurnameOrigin: data.input.principal.surnameOrigin,
      dateIssue: data.input.dateIssue,
      agencyIssue: data.input.agencyIssue,
      timeIssue: data.input.timeIssue,
      applicant: data.input.applicant,
      footerAgency: data.input.footerAgency,
      stamp2: data.input.stamp2,
      text1: data.input.text1,
      text2: (data.input.text2 != "") ? data.input.text2 : `※ This certificate is the ${data.input.documentType}, which contains information pursuant to Article. 15-3 of the Act on Registration of Family Relations.`,
      upDetail: detailUp,
      downDetail: detailDown
    });
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

    return buf;
  }

  //혼인관계증명서 word문서 생성 함수
  async marriagageMakeWordDocument(data) {
    const PizZip = require("pizzip");
    const Docxtemplater = require("docxtemplater");
    const fs = require("fs");
    const path = require("path");
    // Load the docx file as binary content
    const content = fs.readFileSync(
      path.resolve("./wordData", `혼인_${data.input.type}.docx`),
      "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    var detail = [];
    var detailContent = "";
    for (var i = 0; i < data.input.detail.length; i++) {
      detailContent = "";
      for (var j = 0; j < data.input.detail[i].content.length; j++) {
        detailContent += data.input.detail[i].content[j] + "\n"
      }
      detail[i] = {
        category: data.input.detail[i].category,
        content: detailContent
      }
    }
    doc.render({
      title: data.input.documentTitle,
      type: data.input.documentType,
      diplomaticMA: data.input.diplomaticMA,
      "closure": data.input.closure,
      address: data.input.address,
      "hasLoss": false,
      "hasDead": false,
      "hasSpouseDead": (data.input.spouse.status == 2) ? true : false,
      "hasSpouseLoss": (data.input.spouse.status == 3) ? true : false,
      "hasSpouse": data.input.spouse.status,
      "basicSpouse": (data.input.spouse.country == "Korea") ? true : false,
      "noRRNSpouse": (data.input.spouse.country != "Korea" && data.input.spouse.RRN == "") ? true : false,
      "RRNSpouse": (data.input.spouse.country != "Korea" && data.input.spouse.RRN != "") ? true : false,
      "hasDetail": (data.input.detail != null) ? true : false,
      principalName: data.input.principal.name,
      principalBirth: data.input.principal.birth,
      principalRRN: data.input.principal.RRN,
      principalGender: data.input.principal.gender,
      principalSurnameOrigin: data.input.principal.surnameOrigin,
      spouseName: data.input.spouse.name,
      spouseBirth: data.input.spouse.birth,
      spouseRRN: data.input.spouse.RRN,
      spouseGender: data.input.spouse.gender,
      spouseSurnameOrigin: data.input.spouse.surnameOrigin,
      spouseCountry: data.input.spouse.country,
      dateIssue: data.input.dateIssue,
      agencyIssue: data.input.agencyIssue,
      timeIssue: data.input.timeIssue,
      applicant: data.input.applicant,
      footerAgency: data.input.footerAgency,
      stamp2: data.input.stamp2,
      text1: data.input.text1,
      text2: (data.input.text2 != "") ? data.input.text2 : `※ This certificate is the ${data.input.documentType}, which contains information pursuant to Article. 15-3 of the Act on Registration of Family Relations.`,
      detail: detail
    });
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    fs.writeFileSync(path.resolve("./wordData", "output.docx"), buf);

    //await this.s3.uploadFile({Bucket : "iaoallbucket", Key: "testpdf/output.doc", Body: buf, ContentType : "application/msword"})

    //const s3Data = await this.s3.getSignedUrl_Upload({ Bucket: "iaoallbucket", Key: "testpdf/output.doc" })

    return buf;
  }

  async certiDownload() {

  }

  async translateName(input) {
    let translatedText = "";
    for (var i = 0; i < input.length; i++) {
      var result: any = await this.mysql.connectionPool.execute("SELECT spelling FROM namespelling where name = ?", [input[i]]);
      result = result[0];
      translatedText += result[0].spelling.split("|")[0];
      if (i == 0)
        translatedText += ", "
    }
    return translatedText;
  }

  async translateAddress(data){
    let result;
    try {
      await axios({
        method: 'GET',
        url: `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIzMDgwODEwMTIxMjExMzk5ODA=&currentPage=1&countPerPage=10&resultType=JSON&keyword=${data}`,
        headers: {},
      }).then(res => {
        result = res.data.results.juso[0].engAddr + ", Republic of Korea";
        return
      })
        .catch(err => {
          console.log(err);
          return
        })
    } catch {
      console.log('axios error');
      return
    }
    return result 
  }

  async getKoreanAddressInString(targetString){

    const city = ["서울", "대구", "대전"];
    let splitedTargetString = targetString.split(" ");
    let selectedAddress = [];
    for(let i = 0; i < splitedTargetString.length; i++){
      let startIndex = i;
      let lastIndex = 0;
      if(city.filter((el) => {return splitedTargetString[i].includes(el)}).length > 0){
        startIndex = i;
        for(let j = i + 1; j < splitedTargetString.length; j++){
          if(city.filter((el) => {return splitedTargetString[j].includes(el)}).length > 0){
            lastIndex = j - 1;
            break;
          }
          if(j === splitedTargetString.length - 1) lastIndex = j - 1;
        }
        selectedAddress.push(splitedTargetString.slice(startIndex, lastIndex + 1).join(" "))
      }
    }
    selectedAddress[0] = selectedAddress[0].slice(0, selectedAddress[0].length-1);
    selectedAddress[1] = selectedAddress[1].slice(0, selectedAddress[1].length-2);
    return selectedAddress
  }

  async productload(documentId){
    let result;
    try {
      await axios({
        method: 'get',
        url: 'https://0yc95adj3k.execute-api.ap-northeast-2.amazonaws.com/prod/TestOcr',
        header: {
          "Content-Type": "application/json",
        },
        params: { documentId: documentId }
      }).then(res => {
        result = res.data;
        return
      })
        .catch(err => {
          console.log(err);
          return
        })
    } catch {
      console.log('axios error');
      return
    }
    result = await result[0];
    return result;

  }
}