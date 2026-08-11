export const EXCHANGES = {
  EVENTS: 'ecommerce_events',
  DLX: 'ecommerce_dlx',
} as const;

export const QUEUES = {
  INVENTORY: 'inventory_queue',
  ORDER: 'order_queue',
  PAYMENT: 'payment_queue',
  NOTIFICATION: 'notification_queue',
  DLQ: 'dead_letter_queue',
} as const;

export const ROUTING_KEYS = {
  USER_REGISTERED: 'user.registered',
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_RELEASED: 'inventory.released',
  INVENTORY_UPDATED: 'inventory.updated',
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
} as const;

export interface UserRegisteredEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface InventoryItemPayload {
  variantId: string;
  quantity: number;
}

export interface InventoryReservedEvent {
  orderId: string;
  items: InventoryItemPayload[];
  reservedAt: string;
}

export interface InventoryReleasedEvent {
  orderId: string;
  items: InventoryItemPayload[];
  reason: string;
  releasedAt: string;
}

export interface InventoryUpdatedEvent {
  variantId: string;
  sku: string;
  newStockQuantity: number;
  updatedAt: string;
}

export interface OrderItemPayload {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  items: OrderItemPayload[];
  shippingAddress: {
    name: string;
    phone: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface OrderConfirmedEvent {
  orderId: string;
  orderNumber: string;
  userId: string;
  confirmedAt: string;
}

export interface OrderCancelledEvent {
  orderId: string;
  orderNumber: string;
  userId: string;
  reason?: string;
  cancelledAt: string;
}

export interface OrderShippedEvent {
  orderId: string;
  orderNumber: string;
  userId: string;
  shippedAt: string;
}

export interface OrderDeliveredEvent {
  orderId: string;
  orderNumber: string;
  userId: string;
  deliveredAt: string;
}

export interface PaymentInitiatedEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  initiatedAt: string;
}

export interface PaymentSucceededEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  stripePaymentIntentId: string;
  succeededAt: string;
}

export interface PaymentFailedEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  reason: string;
  failedAt: string;
}

export interface PaymentRefundedEvent {
  paymentId: string;
  refundId: string;
  orderId: string;
  userId: string;
  amount: number;
  refundedAt: string;
}
