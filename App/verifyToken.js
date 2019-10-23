// export to every route file to use as middle ware

// middleware to verify our token --- should export 
function verifyToken(req, res, next) {
    var token = req.headers['access-token'];
    // token undefined
    if(!token){
        res.sendStatus(403);
    }

    jwt.verify(token, config.secret, function(err, decoded){
      if(err){
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
      }
    
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();

    });
}

module.exports.verify = verifyToken;