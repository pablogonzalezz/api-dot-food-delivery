const express = require('express');
const getConnection = require('../connection/connectionManager').getConnection;
const router = express.Router();
const verifyJWT = require('../services/jwt');


/**
* Get all items.
**/
router.get('/get_all', async function(req,res,next) {
    try{
        await getConnection().connect( async (err, client, done) => {
            await client.query('SELECT * FROM items ORDER BY id ASC').then(results => {
                if(err) {
                    console.error('error: ', err);
                }
                done();  
                res.status(200).json(results.rows);
            })
        });
    } catch(error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})


/**
* Get specific item by id.
**/
router.get('/get_item/:id', async function(req, res, next) {
    try{
        await getConnection().connect( async (err, client, done) => {
            await client.query(`SELECT * FROM items WHERE id=${req.params.id}`).then(results => {
                if(err) {
                    console.error('error: ', err);
                }
                done();  
                res.status(200).json(results.rows);
            })
        });
    } catch(error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})


/**
* Get items by the item_group id.
**/
router.get('/get_item_by_group/:id', async function(req, res, next) {
    try{
        await getConnection().connect( async (err, client, done) => {
            await client.query(`SELECT * FROM items WHERE group_id=${req.params.id} ORDER BY id ASC`).then(results => {
                if(err) {
                    console.error('error: ', err);
                }
                done();  
                res.status(200).json(results.rows);
            })
        });
    } catch(error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})


/**
* Create an item.
**/
router.post('/create_item', verifyJWT, async function(req, res, next) {
    let item = {
        title: req.body.title || null,
        description: req.body.description || null,
        image: req.body.image || null,
        group_id: req.body.group_id || null,
        price: req.body.price.replace(',', '.') || null
    }

    // CHECANDO CAMPOS OBRIGATÓRIOS
    if(item.title && item.description && item.price) {
        try{
            await getConnection().connect( async (err, client, done) => {
                await client.query(
                    `INSERT INTO items(title, description, image, group_id, price)
                    VALUES('${item.title}', '${item.description}', '${item.image}', '${item.group_id}', ${item.price});`
                ).then(results => {
                    if(err) {
                        console.error('error: ', err);
                    }
                    done();  
                    res.status(200).json(results.rows);
                })
            });
        } catch(error) {
            console.error('erro ao fazer requisição: ', error);
            res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
        }
    } else {
        console.error('erro ao fazer requisição: ', item);
        res.status(500).json({msg: 'Cheque se os campos foram preenchidos adequadamente', obj:item});
    }
})


/**
* Update an item.
**/
router.post('/update_item/:id', verifyJWT, async function(req, res, next) {
    let item = {
        title: req.body.title || null,
        description: req.body.description || null,
        image: req.body.image || null,
        group_id: req.body.group_id || null,
        price: req.body.price.replace(',', '.') || null
    }

    if(item.title && item.description && item.price) {
        try{
            await getConnection().connect( async (err, client, done) => {
                await client.query(
                    `UPDATE items 
                    SET title='${item.title}', description='${item.description}', image='${item.image}', group_id='${item.group_id}', price=${item.price} 
                    WHERE id=${req.params.id}`
                ).then(results => {
                    if(err) {
                        console.error('error: ', err);
                    }
                    done();  
                    res.status(200).json(results.rows);
                })
            });
        } catch(error) {
            console.error('erro ao fazer requisição: ', error);
            res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
        }
    } else {
        console.error('erro ao fazer requisição: ');
        res.status(500).json({msg: 'Cheque se os campos foram preenchidos adequadamente', obj:item});
    }
})


/**
* Delete an item.
**/
router.delete('/delete_item/:id', verifyJWT, async function(req, res, next) {
    try{
        await getConnection().connect( async (err, client, done) => {
            await client.query(
                `DELETE FROM items WHERE id=${req.params.id}`
            ).then(results => {
                if(err) {
                    console.error('error: ', err);
                }
                done();  
                res.status(200).json(results.rows);
            })
        });
    } catch(error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})

module.exports = router;