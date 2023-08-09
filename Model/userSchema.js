const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        require : [true,"user name is required"],
        minLength: [5, 'Name must be at least 5 characters'],
        maxLength: [50, 'Name must be less than 50 characters'],
        trim: true,

    },

    email:{
        type : String,
        require : [true,"user email is required"],
        unique : true,
        lowercase : true,
        unique : [true, "All ready exists"]
    },
    password : {
        type : String,
        select : false
    },
    
    forgotPassword : {
        type : String
    },
    ResetPassword : {
        type : Date
    }

},{timestamps:true})

const userModel = mongoose.model('thumka',userSchema);
module.exports = userModel;