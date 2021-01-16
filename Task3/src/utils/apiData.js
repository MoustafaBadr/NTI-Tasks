const request = require('request')

const getAllData = (cb) => {
    const url = `https://jsonplaceholder.typicode.com/posts`

    request({ url, json:true }, (err, data) => {
        if(err){
            cb('server error', undefined)
        }
        else{
            cb(undefined, data.body)
        }
    })
}
const getSingle = (postId, cb) =>{
    const url = `https://jsonplaceholder.typicode.com/posts/${postId}`
    request({ url, json:true }, (err, data) => {
        if(err){
            cb('server error', undefined)
        }
        else{
            cb(undefined, data.body)
        }
    })
}

module.exports = {getAllData, getSingle}