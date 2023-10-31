import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Providers } from './providers/index';
import { Modules } from './modules/index';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    Providers,
    Modules,
  ]
})
export class AppModule {}
