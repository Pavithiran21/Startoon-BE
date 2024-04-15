
import Jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

export const Authenticate = async (req, res, next) => {
  try {
    console.log("start Token")
    const token = req.headers.authorization;
    if (token) {
      Jwt.verify(token, process.env.JWT_TOKEN, function (error, decode) {
        if (error) {
          res.json({ status:false,message:"Token is expired or invalid. Please try again." });
        } else {

          req.user = decode.id;
          console.log("check decode",decode.id);
          console.log("userId:",req.user);
          
  
          next();
        }
      });
    } else {
      res.json({status:false,message:"No token provided.Access denied."});
    }
  } catch (error) {
    res.json({status:false,message:"Something went wrong."});
  }
};




export const Admin = async (req, res, next) => {
  
  try {
    const user = await User.findById(req.user);
    
    console.log("admin role", user);
    if (user.isAdmin) {
      next();
    } else if(!user.isAdmin){
      console.log("your not admin to accesss the page..");
      res.json({status:false,message:"User cannot access it."});
    }
    else{
      res.json({status:false,message:"Admin can only access it. Please check it"});
    }
  } catch (error) {
    res.json({status:false, message: 'Something went Wrong' });
  }
 
  
};
