const jwt = require('jsonwebtoken')
const settings = process.env;
 
 function getUserIdFromToken(accessToken){
    _id=""
    jwt.verify(accessToken, settings.jwt_secret, (err, decodedToken) => {
        if (err) {
            console.error('Token verification failed:', err);
        } 
        _id =decodedToken.userId;
    });
   
    return _id;
}

module.exports  = getUserIdFromToken; 