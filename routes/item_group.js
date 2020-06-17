const express = require('express');
const getConnection = require('../connection/connectionManager').getConnection;
const router = express.Router();

/**
* Get all items.
**/


router.get('/get_all', async function(req,res,next) {
    try {
        await getConnection().query('SELECT * FROM item_group ORDER BY id ASC', (error, results) => {
            if(error) {
                throw error;
            }
            console.log('requisição completada com sucesso');
            res.status(200).json(results.rows);
        })
    } catch (error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})


module.exports = router;