const jwt = require("jsonwebtoken")


async function middileware(req,res,next){
   
    const token = req.cookies.token



  

    if(!token){
        return res.status(401).json({
            message:"unauthorized user"
        })
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET)

    if(!decoded){
        return res.status(401).json({
            message:"unauthorized user"
        })
    }

    req.user = decoded

   

    next()




}

module.exports = middileware