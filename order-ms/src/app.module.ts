import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoProvider } from './mongo.provider';
import { PaymentCheckController } from './payment-check.controller';
import { RabbitMQProvider } from './rabbitmq.provider';

@Module({
  imports: [],
  controllers: [AppController, PaymentCheckController],
  providers: [AppService, MongoProvider, RabbitMQProvider],
})
export class AppModule {}
