import { request } from "express";
import Student from "../models/student.model.js";
import { sendSUCCESS } from "../utils/response.js";
import { sendError } from "../utils/response.js";

// Create student 
const createStudent = async (req, res)=>{
    try{
        const {firstName, lastName, email, phone, dob, gender, address}= req.body;

        // check if student alreaady exists 
        const existingStudent = await Student.findOne({ email });
        if(existingStudent) {
            return sendError(
                res,
                409,
                "A student with this email already exists"
            );
        }
        const student = await Student.create({
            firstName, lastName, email, phone, dob, gender, address
        });

        return sendSUCCESS(
            res, 
            201,
            "Student created successfully"
        )
    }catch(error){
        console.error("Error creating students: ", error);

        return sendError(
            res, 500, "Failed to create student", error.message
        )
    }
}


// Get all students
const getStudents  = async(req, res)=>{
    try{
        const students = await Student.find().sort({createdAt: -1})
        return sendSUCCESS(res, 200, "Student fetchd successfully", students)
    }catch(error){
        console.error("Error creating students: ", error);

        return sendError(
            res, 500, "Failed to create student", error.message
        );
    }
} 



// GET SINGLE STUDENT 
const getStudent = async (req, res)=>{
    try{
        const { id } = req.params;
        const student = await Student.findById(id)
        // whatever is isnide the findeById() depends on what u attached to req.params

        if(!student){
            return sendError(res, 404, "Student not found")
        }

        return sendSUCCESS(res, 200, "Student fetched successfully", student)
    }catch(error){
        console.error("Get student error:", error);
        return sendError(res, 500, "Failed to fetch student", error.message)
        
    };
};




// UPDATE students
const updateStudent = async(req, res)=>{
     try{
        const { id } = req.params;
        const student = await Student.findByIdAndUpdate(id, req.body, {new: true, runValidators:true});
        if(!student){
            return sendError(res, 404, "Student not found")
        }
         return sendSUCCESS(res, 200, "Student updated successfully", student)
    }catch(error){
        console.error("Updating student error:", error);
        return sendError(res, 500, "Failed to update student if data", error.message)
        
    };
}



// DELETE students
const deleteStudent = async(req, res)=>{
    try{
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);

        if(!student){
            return sendError(res, 404, "Student not found");
        }
         return sendSUCCESS(res, 200, "Student deleted successfully", student)
    }catch(error){
        console.error("Delete student error:", error);
        return sendError(res, 500, "Failed to delete student", error.message)
        
    };
}


// exporting functions 
export { createStudent, getStudents, getStudent, updateStudent, deleteStudent }