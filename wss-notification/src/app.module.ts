import { Module } from '@nestjs/common';
import { RabbitMQProvider } from './rabbitmq.provider';
import { EventsGateway } from './wss.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [RabbitMQProvider, EventsGateway],
})
export class AppModule {}
