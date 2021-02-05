const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    title:{
        type: String,
        required: true,
        trim: true 
    },
    content:{
        type: String,
        required: true,
        trim: true
    },
    image:{
        type:String,
        default:"-"
    }
},
{timestamps:true}
)



const Post = mongoose.model("Post",postSchema)

module.exports = Post
