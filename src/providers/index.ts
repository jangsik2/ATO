/*
  Contain NestJS Modules which contain specific features
*/
import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql/mysql.module';

// AWS CONNECTED MODULES
// NEED CREDENTIAL FILE :: https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
import { S3Module } from './s3/s3.module';

import { HashModule } from './hash/hash.module';
import { JwtModule } from './jwt/jwt.module';

import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    MysqlModule,
    S3Module,
    HashModule,
    JwtModule,
    WebsocketModule,
  ]
})
export class Providers {}
