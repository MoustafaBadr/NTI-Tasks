const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const postModel = require('./posts')
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
        unique:true,
        maxlength:15,
        minlength:2
    },
    image:{
        type:String,
        default:"-"
    },
    age:{
        type:Number,
        default:15,
        validate(value){
            if(value<15) throw new Error('invalid value')
        }
    },
    email:{        
        type: String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('invalid email')
        }
    },
    password:{
        type: String,
        required:true,
        trim:true,
        minLength:6,
        maxLength:100
    },
    role:{
        type: Number,
        required:true,
    },
    tokens:[{
        token:{
            type:String
        }
    }]
},
{timestamps:true}
)

UserSchema.virtual('UserPost',{
    ref:'Post',
    localField:'_id',
    foreignField:'author'
})

UserSchema.methods.toJSON = function(){
    const user = this.toObject()
    // delete user.password
    // delete user.tokens
    // delete user._id
    // delete user.__v
    return user
}

UserSchema.pre('save', async function(next){
    const userData = this
    if(userData.isModified('password')){
        userData.password = await bcrypt.hash(userData.password, 15)
    }
    next()
})

UserSchema.pre('remove', async function(next){
    const user= this
    await postModel.deleteMany({author: user._id})
    next()
})

UserSchema.statics.findLogin = async (email, password) =>{
    const user = await User.findOne({email})
    if(!user) throw new Error('invalid email')
    flag = await bcrypt.compare(password, user.password)
    if(!flag) throw new Error('invalid pass')
    return user
}

UserSchema.methods.generateToken = async function(){
    const user=this
    const token = jwt.sign( { _id:user._id.toString() } , 'finalproject')    
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

const User = mongoose.model('User', UserSchema)
module.exports = User