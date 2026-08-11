import { Request, Response } from 'express';
import { inventoryService, InventoryService } from '../services/inventory.service';

export class InventoryController {
  private service: InventoryService;

  constructor(service: InventoryService = inventoryService) {
    this.service = service;
  }

  getVariantInventory = async (req: Request, res: Response): Promise<void> => {
    const inventory = await this.service.getVariantInventory(req.params.variantId);
    res.status(200).json({
      success: true,
      data: { inventory },
    });
  };

  updateStock = async (req: Request, res: Response): Promise<void> => {
    const updated = await this.service.updateStock(req.params.variantId, req.body);
    res.status(200).json({
      success: true,
      message: 'Stock quantity updated successfully',
      data: { variant: updated },
    });
  };

  reserveStock = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.reserveStock(req.body);
    res.status(200).json({
      success: true,
      message: 'Stock reserved successfully',
      data: result,
    });
  };

  releaseStock = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.releaseStock(req.body);
    res.status(200).json({
      success: true,
      message: 'Stock released successfully',
      data: result,
    });
  };
}

export const inventoryController = new InventoryController();
