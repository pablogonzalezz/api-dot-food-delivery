const Pool = require('pg').Pool;

const bd_settings = {
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'common_db',
  password: 'postgres'
}

const pool = new Pool(bd_settings);

module.exports = {
  pool
}