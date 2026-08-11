export const userSwaggerDocs = {
  paths: {
    '/users/profile': {
      get: {
        tags: ['User'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profile details' } },
      },
      put: {
        tags: ['User'],
        summary: 'Update profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/users/addresses': {
      get: {
        tags: ['User Address'],
        summary: 'List user delivery addresses',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Address list' } },
      },
      post: {
        tags: ['User Address'],
        summary: 'Create address',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Address created' } },
      },
    },
    '/users/wishlist': {
      get: {
        tags: ['Wishlist'],
        summary: 'Get wishlist items',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Wishlist items' } },
      },
      post: {
        tags: ['Wishlist'],
        summary: 'Add item to wishlist',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Wishlist item added' } },
      },
    },
  },
};
