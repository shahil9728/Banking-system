const mongoose=require("mongoose")
const validator = require('validator')
const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:
    {
        type:String,
        required:true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email id');
            }
        }
    },
    balance:
    {
        type:Number,
        required:true,
    }
})
const User = mongoose.model('User',userschema)
module.exports=User;