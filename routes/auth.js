const express = require('express');
const getConnection = require('../connection/connectionManager').getConnection;
const router = express.Router();

router.get('/authenticate', async function(req, res, next) {
    let user = {
        login: req.body.login,
        password: req.body.password
    }
    try {
        await getConnection().connect( async (err, client, done) => {
            await client.query(`SELECT * FROM users WHERE login='${user.login}' AND password='${user.password}'`).then(results => {
                if(err) {
                    console.error('error: ', err);
                }
                done();  
                res.status(200).json(results.rows);
            })
        });
    } catch (error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})


router.post('/create_user', async function(req, res, next) {
    let user = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
        cpf: req.body.cpf
    }
    if (user.login && user.password && user.email && user.cpf) {
        try {
            await getConnection().connect( async (err, client, done) => {
                await client.query(
                    `INSERT INTO users(login,password,email,cpf) VALUES ('${user.login}', '${user.password}', '${user.email}', '${user.cpf}')`
                ).then(results => {
                    if(err) {
                        console.error('error: ', err);
                    }
                    done();  
                    res.status(200).json(results.rows);
                })
            });
        } catch (error) {
            console.error('erro ao fazer requisição: ', error);
            res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
        }
    } else {
        console.error('erro ao fazer requisição: ', user);
        res.status(500).json({msg: 'Cheque se os campos foram preenchidos adequadamente', obj:user});
    }
})

module.exports = router;