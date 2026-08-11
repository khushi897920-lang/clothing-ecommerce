import { Response } from 'express';
import { orderService, OrderService } from '../services/order.service';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';

export class OrderController {
  private service: OrderService;

  constructor(service: OrderService = orderService) {
    this.service = service;
  }

  getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.service.getCart(req.user!.id);
    res.status(200).json({
      success: true,
      data: { cart },
    });
  };

  addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.service.addToCart(req.user!.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { cart },
    });
  };

  updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.service.updateCartItem(req.user!.id, req.params.itemId, req.body);
    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: { cart },
    });
  };

  removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const cart = await this.service.removeCartItem(req.user!.id, req.params.itemId);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { cart },
    });
  };

  checkout = async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await this.service.checkout(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  };

  getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    const orders = await this.service.getUserOrders(req.user!.id);
    res.status(200).json({
      success: true,
      data: { orders },
    });
  };

  getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await this.service.getOrderById(req.params.id, req.user!.id, req.user!.role);
    res.status(200).json({
      success: true,
      data: { order },
    });
  };

  updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await this.service.updateOrderStatus(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    });
  };
}

export const orderController = new OrderController();
