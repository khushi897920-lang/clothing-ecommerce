export const productSwaggerDocs = {
  paths: {
    '/products': {
      get: {
        tags: ['Product'],
        summary: 'Search, filter, and paginate products',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'gender', in: 'query', schema: { type: 'string', enum: ['MEN', 'WOMEN', 'UNISEX'] } },
          { name: 'size', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        ],
        responses: { 200: { description: 'Paginated product list' } },
      },
      post: {
        tags: ['Product Admin'],
        summary: 'Create product (ADMIN only)',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Product created' } },
      },
    },
    '/products/featured': {
      get: {
        tags: ['Product'],
        summary: 'Get featured products',
        responses: { 200: { description: 'Featured products list' } },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Product'],
        summary: 'Get product details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Product details' }, 404: { description: 'Product not found' } },
      },
    },
  },
};
