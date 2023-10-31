/*
  Contain NestJS Modules which contain specific features
*/
import { Module } from '@nestjs/common';


import { AtoModule } from './ato/ato.module';

@Module({
  imports: [
    AtoModule,
  ]
})
export class Modules {}
