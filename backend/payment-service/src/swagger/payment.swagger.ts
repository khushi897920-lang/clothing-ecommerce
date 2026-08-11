export const paymentSwaggerDocs = {
  paths: {
    '/payments/create-intent': {
      post: {
        tags: ['Payment'],
        summary: 'Create Stripe PaymentIntent',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Payment intent created' } },
      },
    },
    '/payments/webhook': {
      post: {
        tags: ['Payment'],
        summary: 'Stripe Webhook handler',
        responses: { 200: { description: 'Webhook processed' } },
      },
    },
    '/payments/refund': {
      post: {
        tags: ['Payment'],
        summary: 'Process refund',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Refund processed' } },
      },
    },
  },
};
