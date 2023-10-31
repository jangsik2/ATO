import { Module } from '@nestjs/common';
import { AtoService } from './ato.service';
import { AtoController } from './ato.controller';

@Module({
  providers: [AtoService],
  controllers: [AtoController]
})
export class AtoModule {}
