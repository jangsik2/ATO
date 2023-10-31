import { Module, Global } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketController } from './websocket.controller';

@Global()
@Module({
  providers: [WebsocketService],
  controllers: [WebsocketController]
})
export class WebsocketModule {}
