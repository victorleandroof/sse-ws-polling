import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RabbitMQProvider } from './rabbitmq.provider';
import { EventsGateway } from './wss.gateway';

@Module({
  imports: [PrometheusModule.register()],
  controllers: [],
  providers: [RabbitMQProvider, EventsGateway],
})
export class AppModule {}
