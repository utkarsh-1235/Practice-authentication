const userModel = require('../Model/userSchema.js');
const emailvalidator = require('email-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

     try{

         const user = await userModel
         .findOne({
            email
        })
         .select('+password')
    
         if(!user || !(await bcrypt.compare(password,))){
            console.log(user)
            return res.status(400).json({
                success: false,
                message: 'invalid credential'
           })
         }
    
         // create json webtoken
    const token = user.jwtToken();
    user.password = undefined;
    //console.log(token);
    const cookieOption = {
        maxAge: 24*60*60*1000, //24h
        httpOnly: true //  not able to modify  the cookie in client side
    }     
    
    console.log(user);
    res.cookie('token',token, cookieOption);
    
    res.status(200).json({
        success: true,
        data: user
    })
     }
     catch(err){
        return res.status(400).json({
            success: false,
            message: err.message
        })
     }
}

/******************************************************
 * @FORGOTPASSWORD
 * @route /api/auth/forgotpassword
 * @method POST
 * @description get the forgot password token
 * @returns forgotPassword token
 ******************************************************/

const forgotPassword = async (req, res, next) => {
    const email = req.body.email;
  
    // return response with error message If email is undefined
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
  
    try {
      // retrieve user using given email.
      const user = await userModel.findOne({
        email
      });
  
      // return response with error message user not found
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "user not found 🙅"
        });
      }
  
      // Generate the token with userSchema method getForgotPasswordToken().
      const forgotPasswordToken = user.getForgotPasswordToken();
  
      await user.save();
  
      return res.status(200).json({
        success: true,
        token: forgotPasswordToken
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  /******************************************************
 * @RESETPASSWORD
 * @route /api/auth/resetpassword/:token
 * @method POST
 * @description update password
 * @returns User Object
 ******************************************************/

const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
  
    // return error message if password or confirmPassword is missing
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword is required"
      });
    }
  
    // return error message if password and confirmPassword  are not same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm Password does not match ❌"
      });
    }
  
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  
    try {
      const user = await userModel.findOne({
        forgotPasswordToken: hashToken,
        forgotPasswordExpiryDate: {
          $gt: new Date() // forgotPasswordExpiryDate() less the current date
        }
      });
  
      // return the message if user not found
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid Token or token is expired"
        });
      }
  
      user.password = password;
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "successfully reset the password"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
/******************************************************
 * @GETUSER
 * @route /api/auth/user
 * @method GET
 * @description retrieve user data from mongoDb if user is valid(jwt auth)
 * @returns User Object
 ******************************************************/
const login = async(req, res, next)=>{
    const userId = req.user.id;
try{
    const user = await userModel.findById(userId);
    return res.send(200).json({
        success: true,
        data: user
    })

}
catch(err){
    return res.send(400).json({
        success: false,
        message: err.message
    })
}
    }

    /******************************************************
 * @LOGOUT
 * @route /api/auth/logout
 * @method GET
 * @description Remove the token form  cookie
 * @returns logout message and cookie without token
 ******************************************************/

const logout = async (req, res, next) => {
  try {
    const cookieOption = {
      expires: new Date(), // current expiry date
      httpOnly: true //  not able to modify  the cookie in client side
    };

    // return response with cookie without token
    res.cookie("token", null, cookieOption);
    res.status(200).json({
      success: true,
      message: "Logged Out"
    });
  } catch (error) {
    res.stats(400).json({
      success: false,
      message: error.message
    });
  }
};

/******************************************************
 * @GETUSER
 * @route /api/auth/user
 * @method GET
 * @description retrieve user data from mongoDb if user is valid(jwt auth)
 * @returns User Object
 ******************************************************/

const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  signup,
  signin,
  forgotPassword,
  login,
  resetPassword,
  logout
};



