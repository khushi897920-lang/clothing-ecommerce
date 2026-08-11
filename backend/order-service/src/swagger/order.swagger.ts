export const orderSwaggerDocs = {
  paths: {
    '/orders/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get active shopping cart',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Active cart details' } },
      },
    },
    '/orders/checkout': {
      post: {
        tags: ['Checkout'],
        summary: 'Checkout active cart into an Order',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Order created' } },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get user order history',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'User orders list' } },
      },
    },
    '/orders/{id}/status': {
      put: {
        tags: ['Orders Admin'],
        summary: 'Update order status (ADMIN only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Order status updated' } },
      },
    },
  },
};
