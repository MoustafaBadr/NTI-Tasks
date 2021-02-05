const express = require('express')
const userModel = require('../models/users')
const router = new express.Router()
const AdminAuth = require('../middleware/AdminAuth')
const GeneralAuth = require('../middleware/authGeneral')
const multer = require('multer')
var uniqueImageName

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'images')
    },
    limits:{fileSize:147852222},
    fileFilter:function(req,file,cb){
        if(file.originalname.match(/\.(jpg|png|pdf)$/)){
            return cb(new Error('Invalid Extension'))
        }
    },
    filename:function(req,file,cb){
        uniqueImageName = 'userImg' + '-' +Date.now() +
        file.originalname.match(/\.(jpg|png|jpeg|pdf)$/)[0]
        cb(null,uniqueImageName)
    }
})

var upload = multer({storage})



router.post('/up',upload.single('upload'),async(req,res)=>{
    res.send('done')
})

router.post('/user/register',upload.single('upload'),async (req, res) => {
    const user = new userModel(req.body)
    try {
        user.image = `images/${uniqueImageName}`
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({
            status: 1,
            message: 'registerd successfully',
            data: { user, token }
        })
    }
    catch (error) {
        res.status(500).send({
            status: 0,
            message: 'inserting error',
            data: { error }
        })
    }
})

router.get('/admin/showAll', AdminAuth, async (req, res) => {
    try {
        alldata = await userModel.find({})
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

router.get('/admin/single/:userid',AdminAuth, async(req,res)=>{
    userid = req.params.userid
    try{
        userData = await userModel.findById(userid)
        if(!userData) return res.send({
            status:2,
            message: 'user not found',
            data: ''
        })
        res.send({
            status:1,
            message: 'user data retriverd',
            data: userdata

        })
    }
    catch(e){
        res.send({
            status:0,
            message: 'data retrive error',
            data: e
        })
    }

})

router.patch('/user/edit/:userid',GeneralAuth, async(req,res)=>{
    avlUpdates = ["image","name", "age"]
    const keys = Object.keys(req.body) 
    const flag = keys.every((k)=> avlUpdates.includes(k))   
    if(!flag) return res.send({
        status:0,
        message:"invalid update keys",
        data:""
    })
    try{
        const user = await userModel.findByIdAndUpdate(
            req.params.userid,
            req.body,
            {runValidators:true}
        )
        if(!user) return res.send({
            status:2,
            message: 'user not found',
            data:''
        })
        res.send({
            status:1,
            message:"updated",
            data: user
        })
    }
    catch(error){
        res.send({
            status:0,
            message: 'error in edit',
            data: {error}
        })
    }
})

// delete my profile as user
router.delete('/user/delete/profile',GeneralAuth, async(req,res)=>{
    try{
        await req.user.remove()
        res.send('removed')
    }
    catch(e){
        res.send({
            status:0,
            message: 'error in delete'
        })
    }
})

//delete users by id as admin
router.delete('/user/delete/:userid',AdminAuth, async(req,res)=>{
    try{
        const user = await userModel.findByIdAndDelete(req.params.userid)
        if(!user) return res.send({
            status:2,
            message: 'user not found'
        })
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

router.post('/user/login', async (req, res) => {

    try {
        const user = await userModel.findLogin(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({
            status: 1,
            message: 'user founded',
            data: { user, token }
        })
    }
    catch (e) {
        res.send({
            status: 0,
            message: 'invalid login',
            data: e
        })
    }
})

router.get('/user/profile', GeneralAuth, async (req, res) => {
    try {
        res.send({
            status: 1,
            data: { 'req.user': req.user },
            message: "User retreived"
        })
    } catch (error) {
        res.send({ status: 0, data: { error }, message: "error loading" })
    }
})

router.post('/user/logout', GeneralAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((singletoken) => {
            return singletoken.token !== req.token
        })
        await req.user.save()
        res.send({
            status: 1,
            message: "logged out"
        })
    }
    catch (e) {
        res.send({
            status: 0,
            message: "cann't logout"
        })
    }
})

// admin can change user type 
router.post('/admin/editType/:userid',AdminAuth,async(req,res)=>{
    try{
        const userId = req.params.userid
        const user = await userModel.findOne({_id:userId})        
        if(!user){
            throw Error('user not found')
        }else{
            if(user.role > 1) {
                user.role = 1
            }else{
                user.role = 2
            }    
            await user.save()
            res.send('Edited')
        } 
    }
    catch(e){
        res.send({
            status:0,
            message: 'error in convert'
        })
    }
})


router.post('/admin/logoutall',AdminAuth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send({
            status:1,
            message:'logged out'
        })
    }
    catch(e){
        res.send({
            status:0,
            message:"cann't logout"
        })
    }
})

module.exports = router