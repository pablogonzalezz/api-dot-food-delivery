const express = require('express');
const jwt = require('jsonwebtoken');
const getConnection = require('../connection/connectionManager').getConnection;
const router = express.Router();

router.post('/authenticate', async function(req, res, next) {
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
                if(results.rows[0]) {
                    if(results.rows[0].login === user.login && results.rows[0].password === user.password) {
                        let id = results.rows[0].id || null;
                        let token = jwt.sign({id}, process.env.SECRET, {
                            expiresIn: 86400
                        })
                        res.json({auth: true, token: token});
                        next();
                    }
                } else {
                    console.log('login não autorizado!')
                    res.status(401).json({message: 'Login inválido!'});
                    next();
                }
            })
        });
    } catch (error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})


router.get('/verify-jwt', async function(req, res, next) {
    try {
        let token = req.headers['x-access-token'];

        if(!token) return res.status(401).json({auth: false, message: 'no token provided'});

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                return res.status(500).json({auth: false, message: 'Failed to authenticate'});
            } else {
                var current_time = Date.now() / 1000;
                if ( decoded.exp < current_time) {
                    return res.status(401).json({auth: false, decoded: decoded, message: 'The token has expired.'})
                } else {
                    return res.status(200).json({auth: true, decoded: decoded, message: 'Its a valid token!'})
                }       
            }
        })
        next();
    } catch (error) {
        console.error('erro ao fazer requisição: ', error);
        res.status(500).json({msg: 'erro ao fazer a requisição', obj:error.message});
    }
})


router.post('/create_user', async function(req, res, next) {
    let user = {
        name: req.body.name,
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
        cpf: req.body.cpf,
        address: JSON.stringify(req.body.address),
        phone: req.body.phone
    }
    
    if (user.login && user.password && user.email && user.cpf && user.address) {
        try {
            await getConnection().connect( async (err, client, done) => {
                await client.query(
                    `INSERT INTO users(login,password,email,cpf,name,address,phone) VALUES ('${user.login}', '${user.password}', '${user.email}', '${user.cpf}', '${user.name}', '${user.address}', '${user.phone}')`
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