import { z } from 'zod';

export const productQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    gender: z.enum(['MEN', 'WOMEN', 'UNISEX']).optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    minPrice: z.string().transform(Number).optional(),
    maxPrice: z.string().transform(Number).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'name_asc']).optional().default('newest'),
    page: z.string().transform(Number).optional().default('1'),
    limit: z.string().transform(Number).optional().default('12'),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(280),
    description: z.string().min(1),
    categoryId: z.string().uuid().optional(),
    audience: z.enum(['MEN', 'WOMEN', 'UNISEX']),
    price: z.number().positive(),
    discountPrice: z.number().positive().optional(),
    images: z
      .array(
        z.object({
          imageUrl: z.string().url(),
          publicId: z.string(),
          isPrimary: z.boolean().optional(),
          displayOrder: z.number().int().optional(),
        })
      )
      .optional(),
    variants: z
      .array(
        z.object({
          sku: z.string().min(1),
          size: z.string().min(1),
          color: z.string().min(1),
          stockQuantity: z.number().int().nonnegative().optional().default(0),
        })
      )
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(120),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
  }),
});

export type ProductQueryDTO = z.infer<typeof productQuerySchema>['query'];
export type CreateProductDTO = z.infer<typeof createProductSchema>['body'];
export type UpdateProductDTO = z.infer<typeof updateProductSchema>['body'];
export type CreateCategoryDTO = z.infer<typeof createCategorySchema>['body'];
