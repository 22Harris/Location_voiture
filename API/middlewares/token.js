const jwt = require('jsonwebtoken');

const existToken = (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({message: 'Pas de token'});
    }

    try{
        const verified = jwt.verify(token.replace('Bearer', ''), MYSECRET);
        req.user = verified;
        next();

    }catch(err){
        console.log(err);
        res.status(400).json({message: err.message});
    }
}

module.exports = existToken;