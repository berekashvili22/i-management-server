import { Inventory } from '../models/inventory.model';

export interface IGetInventories {
    inventories: Inventory[];
    currentPage: number;
    totalPages: number;
    totalInventories: number;
}

export interface IInventories {
    rows: Inventory[];
    count: number;
}

export interface ICreateInventory {
    name: string;
    location: string;
    price: number;
}

export interface IGetInventoryQueries {
    page: number;
    sortField: string | undefined;
    sortOrder: string | undefined;
    locationFilter: string | undefined;
}
