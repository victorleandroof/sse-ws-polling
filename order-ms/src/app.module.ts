import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoProvider } from './mongo.provider';
import { PaymentCheckController } from './payment-check.controller';
import { RabbitMQProvider } from './rabbitmq.provider';

@Module({
  imports: [PrometheusModule.register()],
  controllers: [AppController, PaymentCheckController],
  providers: [AppService, MongoProvider, RabbitMQProvider],
})
export class AppModule {}
