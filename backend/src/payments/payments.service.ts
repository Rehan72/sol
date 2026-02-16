import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { Payment } from '../entities/payment.entity';
import { Quotation } from '../entities/quotation.entity';
import { User } from '../entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../entities/notification.entity';

@Injectable()
export class PaymentsService {
  private razorpay: any;
  private isMockMode: boolean = false;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Quotation) private quotationRepo: Repository<Quotation>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    
    // Check for default placeholder values
    const isPlaceholderKey = 
      !keyId || !keySecret ||
      keyId === 'rzp_test_YOUR_KEY_HERE' || 
      keyId.includes('YOUR_KEY_HERE') ||
      keySecret === 'YOUR_KEY_SECRET' ||
      keySecret.includes('YOUR_SECRET');
    
    if (!isPlaceholderKey && keyId && keyId.startsWith('rzp_')) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } else {
      this.isMockMode = true;
      console.warn('⚠️ RAZORPAY: Running in MOCK MODE - Razorpay keys are missing or are default placeholders.');
      console.warn('   Mock orders will be returned instead of real Razorpay orders.');
    }
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string) {
    // Return mock order if Razorpay is not initialized
    if (this.isMockMode || !this.razorpay) {
      const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: mockOrderId,
        entity: 'order',
        amount: Math.round(amount * 100),
        amount_paid: 0,
        amount_due: Math.round(amount * 100),
        currency: currency,
        receipt: receipt,
        status: 'created',
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt,
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_GATEWAY,
          message: 'Failed to create Razorpay order',
          error: error.message || 'Unknown error from Razorpay API',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET'))
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return generatedSignature === signature;
  }

  generateMockSignature(orderId: string, paymentId: string): string {
    // Generate a mock signature for mock payments
    return crypto
      .createHmac('sha256', 'mock_secret_key')
      .update(orderId + '|' + paymentId)
      .digest('hex');
  }

  async savePayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    milestoneId: string;
    amount: number;
    customerId: string;
    plantAdminId?: string;
    plantId?: string;
    quotationId?: number;
    isMock: boolean;
  }): Promise<Payment> {
    const payment = this.paymentRepo.create({
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      milestoneId: data.milestoneId,
      amount: data.amount,
      customerId: data.customerId,
      plantAdminId: data.plantAdminId,
      plantId: data.plantId,
      quotationId: data.quotationId,
      status: 'COMPLETED',
      isMock: data.isMock,
    });
    
    
    const savedPayment = await this.paymentRepo.save(payment);

    // Send Notification
    await this.notificationsService.send(
      data.customerId,
      'Payment Received! 💳',
      `We have successfully received your payment of ₹${data.amount} for milestone ${data.milestoneId}.`,
      NotificationType.SUCCESS,
      [NotificationChannel.SYSTEM]
    );

    return savedPayment;
  }

  async getPaymentsByPlantAdmin(plantAdminId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { plantAdminId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentsByCustomer(customerId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentByMilestone(customerId: string, milestoneId: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({
      where: { customerId, milestoneId },
    });
  }

  // Map milestoneId to paymentStatus field name
  private milestoneIdToFieldMap: Record<string, string> = {
    'solarModules': 'solarModules',
    'inverters': 'inverters',
    'structure': 'structure',
    'bos': 'bos',
    'installation': 'installation',
    'M1': 'solarModules', // Mapping frontend IDs to existing fields
    'M2': 'inverters',
    'M3': 'structure',
    'M4': 'bos'
  };

  async updateQuotationPaymentStatus(quotationId: number, milestoneId: string): Promise<Quotation | null> {
    const quotation = await this.quotationRepo.findOne({
      where: { id: quotationId }
    });

    if (!quotation) {
      return null;
    }

    // Initialize paymentStatus if not exists
    if (!quotation.paymentStatus) {
      quotation.paymentStatus = {
        solarModules: 'DUE',
        inverters: 'DUE',
        structure: 'DUE',
        bos: 'DUE',
        installation: 'DUE'
      };
    }

    // Map milestoneId to field name
    const fieldName = this.milestoneIdToFieldMap[milestoneId];
    if (fieldName && quotation.paymentStatus[fieldName] !== undefined) {
      quotation.paymentStatus[fieldName] = 'PAID';
    }

    return this.quotationRepo.save(quotation);
  }
  
  async updateCustomerInstallationStatus(customerId: string, status: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id: customerId } });
    if (!user) return null;
    
    user.installationStatus = status;
    return this.userRepo.save(user);
  }
}
