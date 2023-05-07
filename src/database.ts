import { Sequelize } from 'sequelize';

import { db_host, db_port, db_name, db_user, db_password, db_dialect } from './config';

const db = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    port: db_port,
    dialect: db_dialect
});

export default db;
