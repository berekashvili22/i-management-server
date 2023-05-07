import { Inventory } from '../models/inventory.model';

import {
    ICreateInventory,
    IGetInventories,
    IInventories,
    Locations
} from '../types/inventory.types';

import {
    defaultInventorySortFiled as defaultSortFiled,
    defaultInventorySortOrder as defaultSortOrder,
    inventoryToShowPerPage
} from '../config';

/**
 * Return inventories
 * @param currentPage - current page for pagination
 * @param sortFiled - sort field
 * @param sortOrder - sort order
 * @param locationFilter - location filter value
 */
export async function getInventories(
    currentPage: number = 1,
    sortField = defaultSortFiled,
    sortOrder = defaultSortOrder,
    locationFilter = null
): Promise<IGetInventories> {
    const res: IGetInventories = {
        inventories: [],
        currentPage: currentPage,
        totalPages: 0
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
        if (isLocationValid(locationFilter)) {
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

    return res;
}

/**
 * Creates new inventory
 * @param data - inventory data
 */
export async function createInventory(data: ICreateInventory): Promise<boolean> {
    // Check if requested location value is valid
    const isValidLocation: boolean = isLocationValid(data.location.toString());

    if (!isValidLocation) {
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
        inventoryToDelete.destroy();
    } catch (e) {
        console.log(`Error occuared while deleting inventory with id ${id}, error : ${e}`);
        return false;
    }

    return true;
}

/**
 * Checks if location value is included in Locations enum
 * @param location - location value
 */
function isLocationValid(location: string): boolean {
    return Object.values(Locations).includes(location);
}
