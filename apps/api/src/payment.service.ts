import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  async createIntent(amount: number, currency: string) {
    return { paymentIntentId: `pi_stub_${Date.now()}`, amount, currency };
  }

  async capture(paymentIntentId: string) {
    this.logger.log(`Captured stub payment ${paymentIntentId}`);
    return { success: true, paymentIntentId };
  }
}
