import  jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { ResponseHandler } from "../helper/responseHandler.js";

export const auth=async(req,res,next)=>
{

    try {

        const token=req.headers.authorization?req.headers.authorization.split(" ")[1]:null;

        if(!token)
        {
            return ResponseHandler.error(res,401,"Unauthorized - login first") 
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
       

        if(!decoded)
        {
            return ResponseHandler.error(res,401,"Unauthorized - login first") 
        }

        const user=await User.findById(decoded.userId);

        if(!user)
        {
            return ResponseHandler.error(res,404,"User Not Found") 

        }

        req.user=user;
        next();
    } catch (error) {
        console.log("Error in protectRoute Middleware",error.message);
        ResponseHandler.error(res,500,error.message||"Internal Server Error");
    }
}
