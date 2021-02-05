const jwt = require('jsonwebtoken')
const User = require('../models/users')
const auth = async(req,res,next) =>{
   
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decodedToken = jwt.verify( token , "finalproject" )
        const user = await User.findOne({_id:decodedToken._id, 'tokens.token': token,role:1})
        if(!user){ throw new Error() }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        res.send({
            data:e,
            message:'please authintcate',
            status: 0
        })
    }
}
module.exports = auth

