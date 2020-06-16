const express = require('express');
const getConnection = require('./connection/connectionManager').getConnection;


/**
* Get all items.
**/
async function getAll(req, res, next) {
    try {
        await getConnection().query('SELECT * FROM items', (error, results) => {
            if(error) {
                throw error;
            }
            console.log('requisição completada com sucesso');
            res.status(200).json(results.rows);
        })
    } catch (error) {
        console.log('erro ao fazer requisição:' ,error)
    }
}

module.exports = {
    getAll
}