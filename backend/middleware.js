const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
function authMiddleware(req,res,next){
    
    try{
        const token = req.headers.authorization.split(" ")[1];
        
        if(!token){
            res.json({
                message:"cant fetch authorization from header"
            })
        }
        const decoded = jwt.verify(token,JWT_SECRET);
        req._id = decoded.userId;

        next();
    }catch{
        res.status(403).json({
            message:"authorization failed"
        })
    }
}

module.exports={
    authMiddleware
}