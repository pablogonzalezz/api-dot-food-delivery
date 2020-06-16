const createNamespace = require('continuation-local-storage').createNamespace;
const getConnectionBySlug = require('./connectionManager').getConnectionBySlug;

// Create a namespace for the application.
let nameSpace = createNamespace('unique context');

/**
 * Get the connection instance for the given tenant's slug and set it to the current context.
**/
function resolve(req, res, next) {
  const slug = req.subdomains[0];

  if (!slug) {
    res.json({ message: `Please provide tenant's slug to connect.` });
    return;
  }

  // Run the application in the defined namespace. It will contextualize every underlying function calls.
  nameSpace.run(() => {
    nameSpace.set('connection', getConnectionBySlug(slug)); // This will set the knex instance to the 'connection'
    getConnectionBySlug(slug).connect();
    next();
  });
}

module.exports = {
    resolve
}
