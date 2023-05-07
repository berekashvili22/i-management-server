import { Inventory } from '../models/inventory.model';

export interface IGetInventories {
    inventories: Inventory[];
    currentPage: number;
    totalPages: number;
}

export interface IInventories {
    rows: Inventory[];
    count: number;
}

export enum Locations {
    'მთავარი ოფისი',
    'კავეა გალერია',
    'კავეა თბილისი მოლი',
    'კავეა ისთ ფოინთი'
}

export interface ICreateInventory {
    name: string;
    location: typeof Locations;
    price: number;
}
