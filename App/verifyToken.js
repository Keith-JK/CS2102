// export to every route file to use as middle ware
const jwt = require("jsonwebtoken")

secretOrKey = "Hi,Im_a_secret_key"
module.exports = function(req,res,next){
    //const token = req.header('Authorization');
    const token = global.token;
    // console.log("My Auth token:", token)
    if(!token) {
        console.log("ERROR: Accessing protected route without token!")
        return res.status(401).send("Access Denied");
    }

    try{
        const verified = jwt.verify(token, secretOrKey);
        req.user = verified;
        next();
    }catch(err){
        console.log("ERROR: Invalid token, unable to access protected routes!")
        return res.status(400).send("Invalid token")
    }
}