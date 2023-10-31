import { Module, Global } from '@nestjs/common';
import { MysqlService } from './mysql.service';

@Global()
@Module({
  exports: [MysqlService],
  providers: [MysqlService]
})
export class MysqlModule {}
