import { OrderService } from '../services/order.service';

describe('OrderService Unit Tests', () => {
  let orderService: OrderService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findActiveCartByUserId: jest.fn(),
      createCart: jest.fn(),
      addOrUpdateCartItem: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      removeCartItem: jest.fn(),
      markCartConverted: jest.fn(),
      createOrder: jest.fn(),
      findOrderById: jest.fn(),
      findOrdersByUserId: jest.fn(),
      updateOrderStatus: jest.fn(),
    };
    orderService = new OrderService(mockRepository);
  });

  describe('updateOrderStatus state machine validation', () => {
    it('should allow valid transition PENDING -> CONFIRMED', async () => {
      mockRepository.findOrderById.mockResolvedValue({
        id: 'ord-1',
        orderNumber: 'ORD-123',
        status: 'PENDING',
        userId: 'user-1',
      });
      mockRepository.updateOrderStatus.mockResolvedValue({
        id: 'ord-1',
        orderNumber: 'ORD-123',
        status: 'CONFIRMED',
      });

      const updated = await orderService.updateOrderStatus('ord-1', { status: 'CONFIRMED' });
      expect(updated.status).toBe('CONFIRMED');
    });

    it('should reject invalid transition DELIVERED -> PENDING', async () => {
      mockRepository.findOrderById.mockResolvedValue({
        id: 'ord-1',
        status: 'DELIVERED',
      });

      await expect(
        orderService.updateOrderStatus('ord-1', { status: 'PENDING' })
      ).rejects.toThrow('Invalid order status transition from DELIVERED to PENDING');
    });
  });
});
