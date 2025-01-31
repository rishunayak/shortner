import  jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const auth=async(req,res,next)=>
{

    try {

        const token=req.headers.authorization?req.headers.authorization.split(" ")[1]:null;

        if(!token)
        {
            return res.status(401).json({error:"Unauthorized - login first"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
       

        if(!decoded)
        {
            return res.status(401).json({error:"Unauthorized - login first"});
        }

        const user=await User.findById(decoded.userId);

        if(!user)
        {
            return res.status(404).json({error:"User Not Found"});
        }

        req.user=user;
        next();
    } catch (error) {
        console.log("Error in protectRoute Middleware",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
