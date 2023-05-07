import { Router, Request, Response } from 'express';

import {
    createInventory,
    deleteInventoryById,
    getInventories
} from '../services/inventory.service';

const router = Router();

/**
 * Get inventories
 */
router.get('/', async (req: Request, res: Response) => {
    const page: number | undefined =
        typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;

    const result = await getInventories(page);

    res.status(200).json(result);
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

export default router;
