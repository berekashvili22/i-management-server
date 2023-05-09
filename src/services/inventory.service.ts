import { Inventory } from '../models/inventory.model';

import { ICreateInventory, IGetInventories, IInventories } from '../types/inventory.types';

import {
    defaultInventorySortFiled as defaultSortFiled,
    defaultInventorySortOrder as defaultSortOrder,
    inventoryToShowPerPage,
    validLocations
} from '../config';

import { isValidLocation, randomNumInRange } from '../helpers';

/**
 * Return inventories
 * @param currentPage - current page for pagination
 * @param sortField - sort field
 * @param sortOrder - sort order
 * @param locationFilter - location filter value
 */
export async function getInventories(
    currentPage: number = 1,
    sortField: string | undefined = defaultSortFiled,
    sortOrder: string | undefined = defaultSortOrder,
    locationFilter: string | undefined = ''
): Promise<IGetInventories> {
    const res: IGetInventories = {
        inventories: [],
        currentPage: currentPage,
        totalPages: 0,
        totalInventories: 0
    };

    // How many inventories to return per page
    const perPage: number = inventoryToShowPerPage;

    // Offset for pagination
    const offset: number = (currentPage - 1) * perPage;

    // Validate offset
    if (isNaN(offset)) {
        console.log('Invalid offset');
        return res;
    }

    // Create options for get inventories query
    const options: any = {
        limit: perPage,
        offset,
        order: [[sortField, sortOrder]]
    };

    // Check if location filter is provided
    if (locationFilter) {
        // Check if location filter value is valid
        if (isValidLocation(locationFilter)) {
            // Update options with location filter
            options.where = {
                location: locationFilter
            };
        } else {
            console.log(`Invalid locationFilter provided: ${locationFilter}`);
        }
    }

    let inventories: IInventories | undefined;

    // Get inventories
    try {
        inventories = await Inventory.findAndCountAll(options);
    } catch (e) {
        console.log(`Unable to get inventories, error: ${e}`);
        return res;
    }

    res.inventories = inventories.rows;
    res.totalPages = Math.ceil(inventories.count / perPage);
    res.totalInventories = inventories.count;

    return res;
}

/**
 * Creates new inventory
 * @param data - inventory data
 */
export async function createInventory(data: ICreateInventory): Promise<boolean> {
    if (!isValidLocation(data.location?.toString())) {
        console.log(`Unable to create new inventory, invalid location provided: ${data.location}`);
        return false;
    }

    try {
        await Inventory.create({
            name: data.name,
            location: data.location,
            price: data.price
        });
    } catch (e) {
        console.log(`Unable to create new inventory, error : ${e}`);
        return false;
    }

    return true;
}

/**
 * Deletes inventory by id
 * @param id - inventory id
 */
export async function deleteInventoryById(id: number): Promise<boolean> {
    const inventoryToDelete = await Inventory.findByPk(id);

    if (!inventoryToDelete) {
        console.log(`Unable to delete, Inventory with id of ${id} was not found`);
        return false;
    }

    try {
        await inventoryToDelete.destroy();
    } catch (e) {
        console.log(`Error occurred while deleting inventory with id ${id}, error : ${e}`);
        return false;
    }

    return true;
}

/**
 *  Creates random inventories
 * @param total - count of random inventories to create
 */
export async function createRandomInventories(total: number = 300000): Promise<void> {
    // todo replace with bulkupdate
    for (let i = 0; i < total; i++) {
        const rName: string = (Math.random() + 1).toString(36).substring(7);
        const rPrice: number = randomNumInRange(5, 1000);

        const maxLocationsIndex = validLocations.length - 1;

        const rLocationIndex = randomNumInRange(0, maxLocationsIndex);

        const rLocation = validLocations[rLocationIndex];

        const data: ICreateInventory = {
            name: rName,
            price: rPrice,
            location: rLocation
        };

        await createInventory(data);
    }
}
