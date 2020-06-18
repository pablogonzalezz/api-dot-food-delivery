const express = require('express');
const getConnection = require('../connection/connectionManager').getConnection;
const router = express.Router();

/**
* Get all items.
**/
router.get('/get_all', async function(req,res,next) {
    try {
        await getConnection().query('SELECT * FROM items ORDER BY id ASC', (error, results) => {
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

/**
* Get specific item by id.
**/
router.get('/get_item/:id', async function(req, res, next) {
    try {
        await getConnection().query(`SELECT * FROM items WHERE id=${req.params.id}`, (error, results) => {
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

/**
* Get specific item by the item_group id.
**/
router.get('/get_item_by_group/:id', async function(req, res, next) {
    try {
        await getConnection().query(`SELECT * FROM items WHERE group_id=${req.params.id} ORDER BY id ASC`, (error, results) => {
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

/**
* Create an item.
**/
router.post('/create_item', async function(req, res, next) {
    let item = {
        title: req.body.title || null,
        description: req.body.description || null,
        image: req.body.image || null,
        group_id: req.body.group_id || null,
        price: req.body.price || null
    }
    // CHECANDO CAMPOS OBRIGATÓRIOS
    if(item.title && item.description && item.price) {
        try {
            await getConnection().query(
                `INSERT INTO items(title, description, image, group_id, price)
                VALUES('${item.title}', '${item.description}', '${item.image}', '${item.group_id}', '${item.price}');`
                , (error, results) => {
                if(error) {
                    throw error;
                }
                console.log('requisição completada com sucesso');
                res.status(200).json({msg: 'Item criado', obg:item})
            });
        } catch (error) {
            console.error('erro ao fazer requisição: ', error);
            res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
        }
    } else {
        console.error('erro ao fazer requisição: ');
        res.status(500).json({msg: 'Cheque se os campos foram preenchidos adequadamente', obj:item});
    }
})

/**
* Update an item.
**/
router.post('/update_item/:id', async function(req, res, next) {
    let item = {
        title: req.body.title || null,
        description: req.body.description || null,
        image: req.body.image || null,
        group_id: req.body.group_id || null,
        price: req.body.price || null
    }

    if(item.title && item.description && item.price) {
        try {
            await getConnection().query(
                `UPDATE items 
                SET title='${item.title}', description='${item.description}', image='${item.image}', group_id='${item.group_id}, price='${item.price}'' 
                WHERE id=${req.params.id}`, 
                (error, results) => {
                if(error) {
                    throw error;
                }
                console.log('requisição completada com sucesso');
                res.status(200).json({msg:'requisição completada com sucesso'});
            })
        } catch (error) {
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
router.delete('/delete_item/:id', async function(req, res, next) {
    try {
        await getConnection().query(`DELETE FROM items WHERE id=${req.params.id}`, (error, results) => {
            if(error) {
                throw error;
            }
            console.log('requisição completada com sucesso');
            res.status(200).json({msg: `item id=${req.params.id} deletado com sucesso`});
        })
    } catch (error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})

module.exports = router;