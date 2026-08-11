import { prisma } from '../../../shared/prisma/client';
import { Product, Category, Prisma } from '@prisma/client';
import { ProductQueryDTO, CreateProductDTO, UpdateProductDTO, CreateCategoryDTO } from '../dtos/product.dto';

export class ProductRepository {
  async findAll(query: ProductQueryDTO) {
    const { category, gender, size, color, minPrice, maxPrice, search, sortBy, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(gender && { audience: gender }),
      ...(category && {
        category: {
          OR: [{ id: category }, { slug: category }, { name: { contains: category, mode: 'insensitive' } }],
        },
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(size || color
        ? {
            variants: {
              some: {
                ...(size && { size: { equals: size, mode: 'insensitive' } }),
                ...(color && { color: { equals: color, mode: 'insensitive' } }),
              },
            },
          }
        : {}),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'name_asc') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { displayOrder: 'asc' } },
          variants: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFeatured(limit: number = 8) {
    return prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
      },
    });
  }

  async create(data: CreateProductDTO) {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        audience: data.audience,
        price: data.price,
        discountPrice: data.discountPrice,
        categoryId: data.categoryId,
        images: data.images ? { create: data.images } : undefined,
        variants: data.variants ? { create: data.variants } : undefined,
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async update(id: string, data: UpdateProductDTO) {
    const { images, variants, ...productData } = data;
    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Categories
  async findAllCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }
}

export const productRepository = new ProductRepository();
