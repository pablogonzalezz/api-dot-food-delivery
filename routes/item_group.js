const express = require('express');
const getConnection = require('../connection/connectionManager').getConnection;
const router = express.Router();


/**
* Get all item_groups.
**/
router.get('/get_all', async function(req,res,next) {
    try{
        await getConnection().connect( async (err, client, done) => {
            client.query('SELECT * FROM item_group ORDER BY id ASC').then(results => {
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
* Get item_group by id.
**/
router.get('/get_item_group/:id', async function(req,res,next) {
    try{
        await getConnection().connect( async (err, client, done) => {
            await client.query(`SELECT * FROM item_group WHERE id=${req.params.id}`).then(results => {
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
* Create an item_group.
**/
router.post('/create_item_group', async function(req, res, next) {
    let item_group = {
        title: req.body.title || null,
        description: req.body.description || null,
        image: req.body.image || null
    }
    
    // CHECANDO CAMPOS OBRIGATÓRIOS
    if(item_group.title && item_group.description) {
        try{
            await getConnection().connect( async (err, client, done) => {
                await client.query(
                    `INSERT INTO item_group(title, description, image)
                    VALUES('${item_group.title}', '${item_group.description}', '${item_group.image}');`
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
        res.status(500).json({msg: 'Cheque se os campos foram preenchidos adequadamente', obj:item_group});
    }
})


/**
* Update an item_group.
**/
router.post('/update_item_group/:id', async function(req, res, next) {
    let item_group = {
        title: req.body.title || null,
        description: req.body.description || null,
        image: req.body.image || null
    }

    if(item_group.title && item_group.description) {
        try{
            await getConnection().connect( async (err, client, done) => {
                await client.query(
                    `UPDATE item_group 
                    SET title = '${item_group.title}', description='${item_group.description}', image='${item_group.image}' 
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
        res.status(500).json({msg: 'Cheque se os campos foram preenchidos adequadamente', obj:item_group});
    }
});


/**
* Delete an item_group.
**/
router.delete('/delete_item_group/:id', async function(req, res, next) {
    try{
        await getConnection().connect( async (err, client, done) => {
            await client.query(
                `DELETE FROM item_group WHERE id=${req.params.id}`
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