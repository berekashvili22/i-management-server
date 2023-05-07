import express from 'express';
import { Request, Response } from 'express';

import bodyParser from 'body-parser';
import http from 'http';

import db from './database';

import { port as ServerPort, db_name as DBName } from './config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function connectDb() {
    try {
        db.authenticate();
        await db.sync({ force: true, alter: true });

        console.log(`Connected to the database : ${DBName}`);
    } catch (e) {
        console.log(`Unable to connected to the database, error: \n ${e}`);
    }
}

connectDb();

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World'
    });
});

const server = http.createServer(app);

server.listen(ServerPort, () => {
    console.log(`Server started at http://localhost:${ServerPort}`);
});
