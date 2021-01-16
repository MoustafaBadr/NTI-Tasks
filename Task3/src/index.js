const path = require('path')
const hbs = require('hbs')
const express = require('express')
const apidata = require('./utils/apiData')
const app = express()

const publicDirectory = path.join(__dirname, '../public')
const viewsDirectory = path.join(__dirname, '../template/views')
const partialsDirectory = path.join(__dirname, '../template/layouts')

app.set('view engine', 'hbs')
app.set('views', viewsDirectory)
hbs.registerPartials(partialsDirectory)

app.use(express.static(publicDirectory))

app.get('', (req, res)=>{
    apidata.getAllData( (err, apiResponse)=>{
        if(!err){
            flag = false
            mydata = apiResponse
        }
        else{
            flag=true
            mydata = []
        }
        res.render('index', {mydata})
    })
} )


app.get('/:id', (req, res)=>{

    apidata.getSingle(req.params.id, (err, apiResponse)=>{
        if(!err){
            flag = false
            mydata = apiResponse
        }
        else{
            flag=true  
            mydata = []
        }
        console.log(mydata)
        res.render('single', {mydata})
    })
} )

app.listen(3000)