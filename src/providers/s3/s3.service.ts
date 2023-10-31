import { Injectable } from '@nestjs/common';

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {

  public client: S3Client;

  constructor(){
    this.client = new S3Client({
      apiVersion: '2006-03-01', 
      region: "ap-northeast-2"
    });

    // this.getSignedUrl_Upload({Bucket: "dev-iao-useruploadfile", Key: "file/test123"});
  }

  async uploadFile(params: {Bucket: string, Key: string, Body: any, ContentType?: string}): Promise<any>{
    let command = new PutObjectCommand(params);
    await this.client.send(command);
    return
  }

  async getObject(params: {Bucket: string, Key: string}): Promise<any>{
    let command = new GetObjectCommand(params);
    let data = await this.client.send(command);
    return data
  }

  async getPresignedReadUrl(params: {Bucket: string, Key: string}): Promise<string>{
    let command = new GetObjectCommand(params);
    let url = await getSignedUrl(this.client, command, {expiresIn: 60 * 5}); // 5min
    return url
  }

}
