import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { ChangeStream } from 'mongodb';
import {
  from,
  fromEvent,
  iif,
  map,
  mergeMap,
  Observable,
  tap,
} from 'rxjs';
import { MongoProvider } from './mongo.provider';

@Controller()
export class AppController {
  constructor(private readonly mongoProvider: MongoProvider) {}

  @Sse('/payment/status/:id')
  public getStatusPaymentWithMongo(
    @Param('id') orderId: string,
  ): Observable<MessageEvent> {
    return from(this.mongoProvider.getInstance()).pipe(
      map((mongoProvider) => mongoProvider.db('payments').collection('status')),
      map((mongoCollection) => mongoCollection.watch()),
      this.awaitEventChange(),
      this.shouldSendMessageOrStartAgain(orderId)
    );
  }

  private awaitEventChange() {
    return  mergeMap(
      (mongoWatch: ChangeStream<Document>) => fromEvent(mongoWatch, 'change')
    );
  }

  private isChangeOwner(eventChange: any, orderId: string) {
    return eventChange.updateDescription && eventChange.documentKey._id == orderId;
  }

  private shouldSendMessageOrStartAgain(orderId: string) {
    return map((eventChange: any) => {
       if(this.isChangeOwner(eventChange, orderId)) {
        const messageEvent: MessageEvent = {
          data: { ... eventChange.updateDescription.updatedFields, },
        };
        return messageEvent;
       }
       this.getStatusPaymentWithMongo(orderId);
    });
  }
}
