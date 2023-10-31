import { Global, Module } from '@nestjs/common';
import { HashService } from './hash.service';

@Global()
@Module({
  exports: [HashService],
  providers: [HashService]
})
export class HashModule {}
