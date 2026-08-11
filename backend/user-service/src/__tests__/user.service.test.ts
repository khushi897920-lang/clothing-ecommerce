import { UserService } from '../services/user.service';

describe('UserService Unit Tests', () => {
  let userService: UserService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findProfileById: jest.fn(),
      updateProfile: jest.fn(),
      getAddressesByUserId: jest.fn(),
      findAddressById: jest.fn(),
      createAddress: jest.fn(),
      updateAddress: jest.fn(),
      deleteAddress: jest.fn(),
      getWishlistByUserId: jest.fn(),
      addWishlistItem: jest.fn(),
      removeWishlistItem: jest.fn(),
      findWishlistItem: jest.fn(),
    };
    userService = new UserService(mockRepository);
  });

  describe('getProfile', () => {
    it('should return profile for existing user', async () => {
      mockRepository.findProfileById.mockResolvedValue({
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
      });

      const profile = await userService.getProfile('user-1');
      expect(profile.firstName).toBe('John');
      expect(profile.email).toBe('john@example.com');
    });

    it('should throw error if user profile not found', async () => {
      mockRepository.findProfileById.mockResolvedValue(null);
      await expect(userService.getProfile('invalid-id')).rejects.toThrow('User profile not found');
    });
  });
});
