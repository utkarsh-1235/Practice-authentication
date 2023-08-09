const userModel = require('../Model/userSchema.js')
const emailvalidator = require('email-validator')

/******************************************************
 * @SIGNUP
 * @route /api/auth/signup
 * @method POST
 * @description singUp function for creating new user
 * @body name, email, password, confirmPassword
 * @returns User Object
 ******************************************************/
const signup = async(req, res, next)=>{
   const {name, email, password, confirmPassword}  = req.body;
  console.log(name, email, password, confirmPassword)
   //every field required
   if(!name || !email || !password || !confirmPassword){
      return res.status(400).json({
         success: false,
         message: 'Every fields are required'
      })
   }
    
   // check valid email
   const emailvalidate = emailvalidator.validate(email);
   if(!emailvalidate){
     return res.status(400).send({
        success: false,
        message: 'please provide valid email 📩'
     })
   }

   try{
        //password and confirmPassword not match
        if(password !== confirmPassword){
           return res.status(400).json({
             success: false,
             message: 'password and confirm password not match ❌'
           })
        }
     
        const userInfo = new userModel(req.body);
     
        // userSchema "pre" middleware functions for "save" will hash the password using bcrypt
         // before saving the data into the database
     
         const result = await userInfo.save();
         return res.status(200).json({
             success: true,
             message: result
         })

    }
    catch(err){
        if(err.code === 11000){
            return res.status(400).json({
                success: false,
                message: 'user with this account already exists 😒'
            })
        }

        return res.status(400).json({
            message: err.message
        })
    }
}

/******************************************************
 * @SIGNIN
 * @route /api/auth/signin
 * @method POST
 * @description verify user and send cookie with jwt token
 * @body email , password
 * @returns User Object , cookie
 ******************************************************/

const signin = async (req, res, next)=>{
     const {email, password} = req.body;

     if(!email || !password){
        return res.status(200).json({
            success: false,
            message: 'email and password are required'
        })
     }

     const user = await userModel.
     findOne({email})
     .select('+password')

     if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(400).json({
            success: true,
            message: 'invalid credential'
        })
     }

}

module.exports = {signup,
                  signin,
                  };