
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'root';
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    if(req.body.username === adminUsername && req.body.password === adminPassword) {
        const token = jwt.sign({
            username: req.body.username,
        }, 'tokenSecretPrivateKey', { expiresIn: '1h' } )
        res.status(200).json({
            message: 'user succesfully logged in',
            token: token,
            username: req.body.username,
        });
    } else {
        const err = new Error('User is unauthorized');
        err.statusCode = 401;
        next(err);
    }
}

exports.logout = (req, res, next) => {
    
}