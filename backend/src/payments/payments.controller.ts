import { Controller, Post, Get, Body, UseGuards, BadRequestException, HttpException, HttpStatus, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('create-order')
  async createOrder(@Body() body: { amount: number; receipt: string }) {
    if (!body.amount || body.amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }
    
    try {
      const order = await this.paymentsService.createOrder(body.amount, 'INR', body.receipt);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred while creating the order',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('make-payment')
  async makePayment(@Body() body: { 
    orderId?: string; 
    milestoneId: string; 
    customerId?: string; 
    plantAdminId?: string;
    plantId?: string;
    quotationId?: number;
    amount?: number;
  }) {
    // Check for existing payment for the same milestone
    if (body.customerId && body.milestoneId) {
      const existingPayment = await this.paymentsService.getPaymentByMilestone(body.customerId, body.milestoneId);
      if (existingPayment && existingPayment.status === 'COMPLETED') {
        return {
          statusCode: HttpStatus.OK,
          message: 'Payment already exists for this milestone',
          data: {
            razorpay_order_id: existingPayment.razorpayOrderId,
            razorpay_payment_id: existingPayment.razorpayPaymentId,
            is_mock: existingPayment.isMock,
            customerId: body.customerId,
            milestoneId: body.milestoneId,
            paymentId: existingPayment.id,
            duplicate: true,
          },
        };
      }
    }

    // Auto-generate mock orderId if not provided
    let orderId = body.orderId;
    if (!orderId) {
      orderId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Check if we're in mock mode
    const isMockOrder = orderId.startsWith('mock_');
    
    let paymentResult: any;
    
    if (isMockOrder) {
      // Mock payment - simulate successful payment
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockSignature = this.paymentsService.generateMockSignature(orderId, mockPaymentId);
      
      paymentResult = {
        razorpay_order_id: orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
        is_mock: true,
      };
    } else {
      paymentResult = {
        razorpay_order_id: orderId,
        is_mock: false,
      };
    }

    // Save payment record to database
    try {
      const savedPayment = await this.paymentsService.savePayment({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpaySignature: paymentResult.razorpay_signature,
        milestoneId: body.milestoneId,
        amount: body.amount || 0,
        customerId: body.customerId,
        plantAdminId: body.plantAdminId,
        plantId: body.plantId,
        quotationId: body.quotationId,
        isMock: isMockOrder,
      });
      
      // Update quotation payment status if quotationId is provided
      let quotationUpdated = false;
      if (body.quotationId && body.milestoneId) {
        try {
          await this.paymentsService.updateQuotationPaymentStatus(body.quotationId, body.milestoneId);
          quotationUpdated = true;
        } catch (err) {
          console.error('Error updating quotation payment status:', err);
        }
      }
      
      return {
        statusCode: HttpStatus.OK,
        message: isMockOrder ? 'Payment successful (Mock Mode)' : 'Payment processed',
        data: {
          ...paymentResult,
          customerId: body.customerId,
          plantAdminId: body.plantAdminId,
          milestoneId: body.milestoneId,
          paymentId: savedPayment.id,
          quotationUpdated,
        },
      };
    } catch (error) {
      console.error('Error saving payment:', error);
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment processed but failed to save record',
        data: paymentResult,
      };
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('verify')
  async verifyPayment(@Body() body: { orderId: string; paymentId: string; signature: string }) {
    const isValid = this.paymentsService.verifyPayment(
      body.orderId,
      body.paymentId,
      body.signature,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }
    return { status: 'success', message: 'Payment verified' };
  }

  @UseGuards(AccessTokenGuard)
  @Get('plant-payments')
  async getPlantPayments(@Request() req: any) {
    // PlantAdmin can view payments for their plant
    const plantAdminId = req.user.id;
    const payments = await this.paymentsService.getPaymentsByPlantAdmin(plantAdminId);
    return {
      statusCode: HttpStatus.OK,
      data: payments,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('customer-payments/:customerId')
  async getCustomerPayments(@Request() req: any, @Body() body: { customerId: string }) {
    // Get payments for a specific customer
    const customerId = req.params?.customerId || body.customerId;
    const payments = await this.paymentsService.getPaymentsByCustomer(customerId);
    return {
      statusCode: HttpStatus.OK,
      data: payments,
    };
  }
}
