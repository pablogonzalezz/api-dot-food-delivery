const pool = require('pg').Pool;
const commonDBConnection = require('./commonDBConnection');
const getNamespace = require('continuation-local-storage').getNamespace;

let connectionMap;

/**
 *  Create knex instance for all the tenants defined in common database and store in a map.
**/
async function connectAllDb() {
    let tenants;
  
    try {
      const client = await commonDBConnection.pool.connect();
      await client.query('SELECT * FROM tenants').then(res => {tenants = res.rows; client.release()})
      
      console.log('databases connected: ', tenants.map(tenant => tenant.db_name))
    } catch (e) {
      console.log('error', e);
  
      return;
    }
  
    connectionMap =
      tenants
        .map(tenant => {
          return { 
            [tenant.slug]: new pool(createConnectionConfig(tenant).connection)
          }
        })
        .reduce((prev, next) => {
          return Object.assign({}, prev, next);
        }, {});
  }

/**
 *  Create configuration object for the given tenant.
**/
function createConnectionConfig(tenant) {
    return {
      client: 'pg',
      connection: {
        host: tenant.db_host,
        port: tenant.db_port,
        user: tenant.db_username,
        database: tenant.db_name,
        password: tenant.db_password,
      },
      pool: { min: 2, max: 20 }
    };
  }


/**
 *  Get the connection information (knex instance) for the given tenant's slug.
**/
function getConnectionBySlug(slug) {
    if (connectionMap) {
      return connectionMap[slug];
    }
  }

/**
 *  Get the connection information (knex instance) for current context.
**/
function getConnection() {
    const nameSpace = getNamespace('unique context');
    const conn = nameSpace.get('connection');
  
    if (!conn) {
      throw 'Connection is not set for any tenant database.';
    }
  
    return conn;
  }

  module.exports = {
    getConnection,
    getConnectionBySlug,
    createConnectionConfig,
    connectAllDb
  }