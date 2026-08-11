import { ProductService } from '../services/product.service';

describe('ProductService Unit Tests', () => {
  let productService: ProductService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findFeatured: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAllCategories: jest.fn(),
      createCategory: jest.fn(),
    };
    productService = new ProductService(mockRepository);
  });

  describe('getProductById', () => {
    it('should return product details for valid ID', async () => {
      mockRepository.findById.mockResolvedValue({
        id: 'prod-1',
        name: 'Denim Jacket',
        price: 99.99,
        audience: 'UNISEX',
      });

      const product = await productService.getProductById('prod-1');
      expect(product.name).toBe('Denim Jacket');
    });

    it('should throw error if product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(productService.getProductById('invalid-id')).rejects.toThrow('Product not found');
    });
  });
});
