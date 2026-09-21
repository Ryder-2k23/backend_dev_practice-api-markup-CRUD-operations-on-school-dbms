import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import { sendError, sendSUCCESS } from "../utils/response.js";
import env from "dotenv"


env.config();

//Generate a token
const generateToken = (user)=>{
    return jwt.sign(
        {
            id:user._id,
            role:user.role
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
};

//Register Student

export const registerStudent = async (req,  res)=>{
    try {
        const {firstName, lastName, email, password, phone, gender, dob, address}= req.body;
        if(!firstName || !lastName || !email || !password){
            return sendError(res, 400, "First name, last name, email and password are required");
        }

        //to prevent maliscious emails from attackers
        const normalizeEmail = email.toLowerCase()


        //check authentication acct.
        const existingUser = await User.findOne({email:normalizeEmail});
        if(existingUser){
         return sendError(res, 409, "A user with this email already exists");
        };

        //check shool profile
        const existingStudent = await Student.findOne({email:normalizeEmail});
        if(existingStudent){
         return sendError(res, 409, "A student with this email already exists");
        };


        //hashing password
        const harshPassword = await bcrypt.hash(password, 10);

        //create student profile
        const student = await Student.create({
            firstName,
            lastName,
            email: normalizeEmail,
            phone,
            dob,
            gender,
            address
        });

        //create auth acct.
        const user = await User.create({
            email: normalizeEmail,
            password: harshPassword.at,
            role: "student",
            student: student._id
        });

        //connect student to the user
        student.user = user._id;
        await student.save();


        const token = generateToken(user);
        return sendSUCCESS(res,201,"Student registration successful", {
            user:{
                id:user._id,
                email: user.email,
                role:user.role
            },
             student:{
                id:student._id,
               firstName:student.firstName,
               lastName : student.lastName,
               email: student.email
            },
            accessToken: token
        })
    }  catch (error) {
        console.error(" error: ", error);
        return sendError(res, 500, "Failed to register student", error.message);
    };
}



export const registerTeacher = async (req,  res)=>{
    try {
        const {firstName, lastName, email, password, phone,Speacialization,qualification}= req.body;
        if(!firstName || !lastName || !email || !password){
            return sendError(res, 400, "First name, last name, email and password are required");
        }

        //to prevent maliscious emails from attackers
        const normalizeEmail = email.toLowerCase()


        //check authentication acct.
        const existingUser = await User.findOne({email:normalizeEmail});
        if(existingUser){
         return sendError(res, 409, "A user with this email already exists");
        };

        //check shool profile
        const existingTeacher = await User.findOne({email:normalizeEmail});
        if(existingTeacher){
         return sendError(res, 409, "A teacher with this email already exists");
        };


        //hashing password
        const harshPassword = await bcrypt.hash(password, 10);

        //create teacher profile
        const teacher = await Teacher.create({
            firstName,
            lastName,
            email: normalizeEmail,
            phone,
           Speacialization,
           qualification
        });

        //create auth acct.
        const user = await User.create({
            email: normalizeEmail,
            password: harshPassword,
            role: "teacher",
            student: teacher._id
        });

        //connect teacher to the user
        teacher.user = user._id;
        await teacher.save();


        const token = generateToken(user);
        return sendSUCCESS(res,201,"Teacher registration successful", {
            user:{
                id:user._id,
                email: user.email,
                role:user.role
            },
             teacher:{
                id:teacher._id,
               firstName:teacher.firstName,
               lastName : teacher.lastName,
               email: teacher.email
            },
            accessToken: token
        })
    }  catch (error) {
        console.error(" error: ", error);
        return sendError(res, 500, "Failed to register teacher", error.message);
    };
}


export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return sendError(res, 400, "Email and password are required");  
        }

        const normalizeEmail = email.toLowerCase();


        //include password  bcuz schema uses select:false so password hidden is  now found
        const user = await User.findOne({email:normalizeEmail})
        .select("+password")
        .populate("students")
        .populate("teacher");

        console.log("Email recieved: ", email);
        console.log("Normalized email: ", normalizeEmail );
        console.log("User found: ", user);;
        
        
        

        if(!user){
           return sendError(res, 401, "user is not found")
        }

        // remeber password was hashed, now unhash it
        //compare password
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        console.log("password correct", passwordIsCorrect);
        
        if(!passwordIsCorrect){
            return sendError(res, 401, "Invalid email or password")
        }
        const token = generateToken(user);
        return sendSUCCESS(res, 200, "Login successful", 
            {
                user:{
                id:user._id,
                email:user.email,
                role: user.role
                },
                student: user.students || null,
                teacher: user.teacher || null,
                accessToken: token
            }
)
    } catch (error) {
        console.error("Login error: ", error);
        return sendError(res, 500, "Failed to login", error.message);
    };
}