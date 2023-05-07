import * as dotenv from 'dotenv';

dotenv.config({
    path: `${__dirname}/../.env`
});

// Server config
export const port = Number(process.env.API_PORT);

// DB Config
export const db_host = String(process.env.DB_HOST);
export const db_port = Number(process.env.DB_PORT);
export const db_name = String(process.env.DB_NAME);
export const db_user = String(process.env.DB_USER);
export const db_password = String(process.env.DB_PASSWORD);
export const db_dialect = 'postgres';

// Inventory query config
export const inventoryToShowPerPage = 20;
export const defaultInventorySortFiled = 'name';
export const defaultInventorySortOrder = 'ASC';
