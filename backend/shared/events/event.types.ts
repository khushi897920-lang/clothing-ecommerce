export interface BaseEvent {
  eventId: string;
  timestamp: string;
  eventType: string;
}

export interface UserRegisteredEvent extends BaseEvent {
  eventType: "UserRegistered";
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  verificationToken?: string;
}

export interface OrderPlacedEvent extends BaseEvent {
  eventType: "OrderPlaced";
  orderId: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export interface OrderCancelledEvent extends BaseEvent {
  eventType: "OrderCancelled";
  orderId: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export interface InventoryReservedEvent extends BaseEvent {
  eventType: "InventoryReserved";
  orderId?: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export interface InventoryReleasedEvent extends BaseEvent {
  eventType: "InventoryReleased";
  orderId?: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export interface PaymentConfirmedEvent extends BaseEvent {
  eventType: "PaymentConfirmed";
  paymentId: string;
  orderId: string;
  userId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
}

export interface PaymentFailedEvent extends BaseEvent {
  eventType: "PaymentFailed";
  paymentId: string;
  orderId: string;
  userId: string;
  reason?: string;
  amount: number;
}

export interface ShipmentUpdatedEvent extends BaseEvent {
  eventType: "ShipmentUpdated";
  orderId: string;
  orderNumber: string;
  userId: string;
  status: "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED";
}

export interface RefundCompletedEvent extends BaseEvent {
  eventType: "RefundCompleted";
  refundId: string;
  paymentId: string;
  orderId: string;
  userId: string;
  stripeRefundId?: string;
  amount: number;
  reason?: string;
}
