import { Controller, Get, Req, Res, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AtoService } from './ato.service'

@Controller('ato')
export class AtoController {

  constructor(
    private readonly atoService: AtoService,
  ){}

  @Get('wordstatus')
  async wordstatus(
    @Req() req,
    @Res() res
  ){
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
    return res.status(200).send({status : status});
  }

  @Post('download')
  async atoPost(
    @Body() requestData,
    @Req() req,
    @Res() res
  ){
    console.log(requestData)
    let buffer = await this.atoService.wordDownload(requestData.data, requestData.status);
    console.log(buffer)
    return res.status(200).send(buffer);
  }

  @Get('translateName')
  async translateName(
    @Req() req,
    @Res() res
  ){
    let result = await this.atoService.translateName(req.query.translateName);
    return res.status(200).send({translatedText : result});
  }

  @Get('test')
  async test(
    @Req() req,
    @Res() res
  ){
    return res.status(200).send("test");
  }
}
