import { InventoryService } from '../services/inventory.service';

describe('InventoryService Unit Tests', () => {
  let inventoryService: InventoryService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findVariantById: jest.fn(),
      updateStock: jest.fn(),
      reserveVariantStock: jest.fn(),
      releaseVariantStock: jest.fn(),
    };
    inventoryService = new InventoryService(mockRepository);
  });

  describe('getVariantInventory', () => {
    it('should return inventory status for variant', async () => {
      mockRepository.findVariantById.mockResolvedValue({
        id: 'var-1',
        sku: 'TSHIRT-BLK-M',
        size: 'M',
        color: 'Black',
        stockQuantity: 50,
        reservedQuantity: 5,
      });

      const inv = await inventoryService.getVariantInventory('var-1');
      expect(inv.availableQuantity).toBe(45);
      expect(inv.sku).toBe('TSHIRT-BLK-M');
    });

    it('should throw error if variant not found', async () => {
      mockRepository.findVariantById.mockResolvedValue(null);
      await expect(inventoryService.getVariantInventory('invalid-id')).rejects.toThrow('Product variant not found');
    });
  });
});
