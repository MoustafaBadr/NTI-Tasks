const mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required:true,
        trim:true,
        minLength: 2,
        maxLength: 50
    },
    balance:{
        type:Number,
        required:true,
        validate(value){
            if(value<0) throw new Error('Invalid Balance Value')
        }
    },
    accountnumber:{        
        type: Number,
        required:true,
        unique:true,
    }
});

mongoose.model('Customer', customerSchema);