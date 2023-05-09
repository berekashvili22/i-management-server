import { Router, Request, Response } from 'express';

import {
    createInventory,
    createRandomInventories,
    deleteInventoryById,
    getInventories
} from '../services/inventory.service';
import { validateGetInventoryQuery } from '../helpers';

const router = Router();

/**
 * Get inventories
 */
router.get('/', async (req: Request, res: Response) => {
    // Validate query parameters
    const { page, sortField, sortOrder, locationFilter } = validateGetInventoryQuery(req.query);

    const result = await getInventories(page, sortField, sortOrder, locationFilter);

    if (result) {
        return res.status(200).json(result);
    }

    res.status(400).json();
});

/**
 * Create inventory
 */
router.post('/', async (req: Request, res: Response) => {
    const created = await createInventory(req.body);

    if (!created) {
        return res.status(400).json();
    }

    res.status(201).json();
});

/**
 * Delete inventory
 * @param id - inventory id
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const deleted = await deleteInventoryById(parseInt(req.params.id));

    if (!deleted) {
        return res.status(400).json();
    }

    res.status(200).json();
});

router.get('/createRandomInventories/:amount', async (req: Request, res: Response) => {
    await createRandomInventories(parseInt(req.params.amount));

    return res.status(200).json();
});

export default router;
