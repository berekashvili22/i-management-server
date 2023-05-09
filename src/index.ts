import express from 'express';

import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';

import db from './database';

import { port as ServerPort, db_name as DBName } from './config';

import inventoryRoutes from './routes/inventory.routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

async function connectDb() {
    try {
        await db.authenticate();
        await db.sync({ force: true, alter: true });

        console.log(`Connected to the database : ${DBName}`);
    } catch (e) {
        console.log(`Unable to connected to the database, error: \n ${e}`);
    }
}

connectDb();

app.use('/inventories', inventoryRoutes);

const server = http.createServer(app);

server.setTimeout(5000000);

server.listen(ServerPort, () => {
    console.log(`Server started at http://localhost:${ServerPort}`);
});
