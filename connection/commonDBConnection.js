const Pool = require('pg').Pool;

const bd_settings = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'common_db',
  password: process.env.DB_PASSWORD
}

const pool = new Pool(bd_settings);


module.exports = {
  pool
}