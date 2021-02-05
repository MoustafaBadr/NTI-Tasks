const express=require('express')
const postModel = require('../models/posts')
const GeneralAuth = require('../middleware/authGeneral') 
const AdminAuth =require('../middleware/AdminAuth')
const TeacherAuth =require('../middleware/TeacherAuth') 
const StudentAuth = require('../middleware/StudentAuth')

const router = new express.Router()

router.post('/post/user/add',GeneralAuth, async(req,res)=>{
    PostData = new postModel({
        ...req.body,
        author: req.user._id
    })
    try{
        await PostData.save()
        res.status(200).send({
            status:1,
            message:'post added', 
            data: PostData
        })
    }
    catch(error){
        res.status(500).send({
            status:0,
            message:'error adding',
            data:{error}
        })
    }
})

// any user view all user posts created
router.get('/post/admin/showAll', GeneralAuth, async (req, res) => {
    try {
        alldata = await postModel.find({})
        res.status(200).send({
            status: 1,
            message: 'all data retriverd',
            data: { alldata }
        })
    }
    catch (e) {

        res.status(500).send({
            status: 0,
            message: 'data retreving error',
            data: e
        })
    }
})

// admin delete any post by it's id
router.delete('/post/admin/delete/:posti    d',AdminAuth, async(req,res)=>{
    try{
        const post = await postModel.findByIdAndDelete(req.params.postid)
        if(!post) return res.send({
            status:2,
            message: 'post not found'
        })
        res.send({
            status:1,
            message:"deleted"
        })
    }
    catch(e){
        res.send({
            status:0,
            message: 'error in delete post'
        })
    }
})


router.get('/post/me',GeneralAuth,async(req,res)=>{
     data = await postModel.find({author:req.user._id})
     
     res.send(data)
    try{
        await req.user.populate('UserPost').execPopulate()
        res.send(req.user.UserPost)
    }
    catch(error){
        res.send(
            {    
                status:0,
                data:{error},
                message:"no post"
            }
        )}

})

// admin can get any post by it's id
router.get('/post/admin/:id',AdminAuth, async(req,res)=>{
    const _id = req.params.id
    try{
        const post = await postModel.find({_id, author:req.user._id})
        if(!post) res.send('post not found')
        else res.send(post)
    }
    catch(error){
        res.send({
            status:0,
            data:{error}
        })
    }
})

//Update only posts user created
router.patch('/post/edit/:postid',GeneralAuth, async(req,res)=>{

    avlUpdates = ["title","content"]
    const keys = Object.keys(req.body) 
    const flag = keys.every((k)=> avlUpdates.includes(k))   
    if(!flag) return res.send({
        status:0,
        message:"invalid update keys",
        data:""
    })
    try{
        const postId = req.params.postid
        const post = await postModel.findOne({_id:postId})
        keys.forEach((update)=> {
            post[update] = req.body[update]
        })
        await post.save()
        res.send('Updated')
    }
    catch(error){
        res.send({
            status:0,
            message:'error in edit',
            data: {error}
        })
    }
})

//delete only posts user created
router.delete('/post/delete/:postid',GeneralAuth, async(req,res)=>{
    try{
        const postId = req.params.postid
        const post =await postModel.findOne({_id:postId})
        if(!post) throw new Error('post not found')
        await post.remove()
        res.send({
            status:1,
            message:"deleted"
        })
    }
    catch(e){
        res.send({
            status:0,
            message: 'error in delete'
        })
    }
})

     

module.exports = router