const express = require('express');
const getConnection = require('../connection/connectionManager').getConnection;
const router = express.Router();

router.get('/get_user_address/:login', async function(req, res, next) {
    
    if (req.params.login) {
        try {
            await getConnection().connect( async (err, client, done) => {
                await client.query(
                    `SELECT address FROM users WHERE login='${req.params.login}'`
                ).then(results => {
                    if(err) {
                        console.error('error: ', err);
                    }
                    done();  
                    res.status(200).json(results.rows[0].address);
                })
            });
        } catch (error) {
            console.error('erro ao fazer requisição: ', error);
            res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
        }
    } else {
        console.error('erro ao fazer requisição: ');
        res.status(500).json({msg: 'Cheque se os campos foram preenchidos adequadamente'});
    }
})

module.exports = router;