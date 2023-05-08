import pg from 'pg';
import keys from './keys.js';

const { Pool } = pg;

const db = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: parseInt(keys.pgPort)
});

export default db;