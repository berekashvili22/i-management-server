import { validLocations, validSortFields, validSortOrders } from '../config';

import { IGetInventoryQueries } from '../types/inventory.types';

/**
 * Returns validated query parameters with correct types
 * @param query - request query
 */
export const validateGetInventoryQuery = (query: any): IGetInventoryQueries => {
    let page: number = 1;
    let sortField: string | undefined;
    let sortOrder: string | undefined;
    let locationFilter: string | undefined;

    if (typeof query.queryPage === 'string') {
        const requestedPage = parseInt(query.page);

        if (!isNaN(requestedPage)) {
            page = requestedPage;
        }
    }

    if (typeof query.sortField === 'string') {
        if (validSortFields.includes(query.sortField)) {
            sortField = query.sortField;
        }
    }

    if (typeof query.sortOrder === 'string') {
        if (validSortOrders.includes(query.sortOrder)) {
            sortOrder = query.sortOrder;
        }
    }

    if (typeof query.location === 'string') {
        if (isValidLocation(query.location)) {
            locationFilter = query.location;
        }
    }

    return { page, sortField, sortOrder, locationFilter };
};

/**
 * Checks if requested location filter is valid
 * @param location - requested location filter
 */
export const isValidLocation = (location: string): boolean => {
    if (validLocations.includes(location)) {
        return true;
    }

    return false;
};

/**
 * Generates random number in provided min-max range
 * https://stackoverflow.com/questions/4194628/how-to-generate-random-numbers-in-javascript
 * @param min - min value of random number
 * @param max - max value of random number
 */
export const randomNumInRange = (min: number, max: number): number => {
    const r: number = Math.random();
    return Math.floor(r * (max + 1 - min) + min);
};
