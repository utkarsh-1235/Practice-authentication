const mongoose = require('mongoose');

const {Schema} = mongoose;

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const JWT = require('jsonwebtoken')

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

// // Hash password before saving to the database
// userSchema.pre('save', async function(next){
//     // If password is not modified then do not hash it
//     if(!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     return next();
// });
// Hash password before saving to the database
userSchema.pre('save', async function (next) {
    // If password is not modified then do not hash it
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  });

//FIXME: Check if these methods are working as expected
userSchema.methods = {
    //method for generating the jwt token
    jwtToken(){
        return JWT.sign(
            {id: this._id, email:this.email},
            process.env.SECRET,
            {expiresIn: '24h'} // 24 hours
        )
    }
}
const userModel = mongoose.model('thumka',userSchema);
module.exports = userModel;