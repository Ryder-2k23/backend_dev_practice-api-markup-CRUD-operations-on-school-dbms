import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import  dotenv  from "dotenv";


dotenv.config()

export const authMiddleware = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization; //this simple means go to tthe headers and look fo tokens cause every requests u make has headers

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Authentication required"
            })
        }
        const  token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password")
        .populate("students")
        .populate("teacher");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User account no longer exists"
            })
        }

        req.user = user;
        next()

    } catch (error) {
        console.error("Authentication error: ", error);
        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                success: false,
                message: "Inavlid token"
            })
        }
        return res.status(401).json({
            success:false,
            message: "Autehntication failed"
        })
    }
}

export const roleMiddleware = (...allowedRoles)=>{
    return(req, res, next)=>{
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"Authentication required"
            })
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message:"You do not have permission to perform this action"
            })
        }
        next();
    }
}
