import { productRepository, ProductRepository } from '../repositories/product.repository';
import { ProductQueryDTO, CreateProductDTO, UpdateProductDTO, CreateCategoryDTO } from '../dtos/product.dto';
import { AppError } from '../../../shared/middleware/error.middleware';
import { redisService } from '../../../shared/redis/client';

export class ProductService {
  private repository: ProductRepository;

  constructor(repository: ProductRepository = productRepository) {
    this.repository = repository;
  }

  private generateCacheKey(prefix: string, params: object): string {
    const sorted = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    return `${prefix}:${sorted || 'all'}`;
  }

  async getAllProducts(query: ProductQueryDTO) {
    const cacheKey = this.generateCacheKey('products:list', query);
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.repository.findAll(query);
    await redisService.set(cacheKey, result, 600); // 10 minutes cache
    return result;
  }

  async getFeaturedProducts() {
    const cacheKey = 'products:featured';
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const products = await this.repository.findFeatured(8);
    await redisService.set(cacheKey, products, 900); // 15 minutes cache
    return products;
  }

  async getProductById(id: string) {
    const cacheKey = `products:detail:${id}`;
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await redisService.set(cacheKey, product, 1800); // 30 minutes cache
    return product;
  }

  async createProduct(dto: CreateProductDTO) {
    const product = await this.repository.create(dto);
    await redisService.invalidatePattern('products:*');
    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDTO) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    const updated = await this.repository.update(id, dto);
    await redisService.invalidatePattern('products:*');
    return updated;
  }

  async deleteProduct(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    await this.repository.delete(id);
    await redisService.invalidatePattern('products:*');
    return { message: 'Product deleted successfully' };
  }

  async getCategories() {
    const cacheKey = 'products:categories';
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.repository.findAllCategories();
    await redisService.set(cacheKey, categories, 3600);
    return categories;
  }

  async createCategory(dto: CreateCategoryDTO) {
    const category = await this.repository.createCategory(dto);
    await redisService.invalidatePattern('products:*');
    return category;
  }
}

export const productService = new ProductService();
