export const authSwaggerDocs = {
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password'],
                properties: {
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  password: { type: 'string', example: 'SecureP@ss123' },
                  phone: { type: 'string', example: '+1234567890' },
                  role: { type: 'string', enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'john.doe@example.com' },
                  password: { type: 'string', example: 'SecureP@ss123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        responses: {
          200: { description: 'Token refreshed' },
          401: { description: 'Invalid or expired token' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user',
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
  },
};
