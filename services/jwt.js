const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
    let token = req.headers['x-access-token'];
    
    if(!token) return res.status(401).json({auth: false, message: 'no token provided'});

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) return res.status(500).json({auth: false, message: 'Failed do authenticate'});

        req.user_id = decoded.id;
    })
    next();
}

module.exports = verifyJWT