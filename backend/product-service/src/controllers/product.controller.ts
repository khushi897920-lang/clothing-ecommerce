import { Request, Response } from 'express';
import { productService, ProductService } from '../services/product.service';

export class ProductController {
  private service: ProductService;

  constructor(service: ProductService = productService) {
    this.service = service;
  }

  getProducts = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.getAllProducts(req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  };

  getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await this.service.getFeaturedProducts();
    res.status(200).json({
      success: true,
      data: { products },
    });
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    const product = await this.service.getProductById(req.params.id);
    res.status(200).json({
      success: true,
      data: { product },
    });
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await this.service.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await this.service.updateProduct(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.deleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  getCategories = async (req: Request, res: Response): Promise<void> => {
    const categories = await this.service.getCategories();
    res.status(200).json({
      success: true,
      data: { categories },
    });
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const category = await this.service.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  };
}

export const productController = new ProductController();
