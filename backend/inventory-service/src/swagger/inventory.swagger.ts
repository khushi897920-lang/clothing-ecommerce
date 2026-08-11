export const inventorySwaggerDocs = {
  paths: {
    '/inventory/variants/{variantId}': {
      get: {
        tags: ['Inventory'],
        summary: 'Get variant inventory status',
        parameters: [{ name: 'variantId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Inventory status' } },
      },
      put: {
        tags: ['Inventory Admin'],
        summary: 'Update stock quantity (ADMIN only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'variantId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Stock updated' } },
      },
    },
    '/inventory/reserve': {
      post: {
        tags: ['Inventory'],
        summary: 'Reserve stock for order',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Stock reserved' } },
      },
    },
    '/inventory/release': {
      post: {
        tags: ['Inventory'],
        summary: 'Release reserved stock',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Stock released' } },
      },
    },
  },
};
