import { AuthService } from '../services/auth.service';

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      createUser: jest.fn(),
      createRefreshToken: jest.fn(),
      findRefreshToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
      revokeAllUserRefreshTokens: jest.fn(),
      createEmailVerificationToken: jest.fn(),
      createPasswordResetToken: jest.fn(),
      findPasswordResetToken: jest.fn(),
      updatePasswordAndMarkResetTokenUsed: jest.fn(),
    };
    authService = new AuthService(mockRepository);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockRepository.findUserByEmail.mockResolvedValue(null);
      mockRepository.createUser.mockResolvedValue({
        id: 'user-uuid-1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        role: 'CUSTOMER',
        emailVerified: false,
        createdAt: new Date(),
      });
      mockRepository.createEmailVerificationToken.mockResolvedValue({});
      mockRepository.createRefreshToken.mockResolvedValue({});

      const result = await authService.register({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'Password123!',
      });

      expect(result.user.email).toBe('jane@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockRepository.createUser).toHaveBeenCalled();
    });

    it('should throw an error if user email already exists', async () => {
      mockRepository.findUserByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.register({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow('Email address is already registered');
    });
  });
});
