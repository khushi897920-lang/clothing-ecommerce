import { Request, Response } from 'express';
import { paymentService, PaymentService } from '../services/payment.service';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';

export class PaymentController {
  private service: PaymentService;

  constructor(service: PaymentService = paymentService) {
    this.service = service;
  }

  createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this.service.createPaymentIntent(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Payment Intent created successfully',
      data: result,
    });
  };

  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'] as string;
    const result = await this.service.processWebhook(req.body, signature);
    res.status(200).json(result);
  };

  refund = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this.service.processRefund(req.user!.id, req.user!.role, req.body);
    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: { refund: result },
    });
  };

  getOrderPayments = async (req: AuthRequest, res: Response): Promise<void> => {
    const payments = await this.service.getOrderPayments(
      req.params.orderId,
      req.user!.id,
      req.user!.role
    );
    res.status(200).json({
      success: true,
      data: { payments },
    });
  };
}

export const paymentController = new PaymentController();
