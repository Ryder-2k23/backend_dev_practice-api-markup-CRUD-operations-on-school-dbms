import Teacher from "../models/teacher.model.js";
import Course from "../models/courses.model.js";
import { sendSUCCESS, sendError } from "../utils/response.js";

// CREATE teacher
const createTeacher = async(req, res)=>{
    try {
        const { firstName, lastName, email, phone, Speacialization} = req.body;

        const existingTeacher = await Teacher.findOne({email});

        if(existingTeacher){
            return sendError(res, 409, "A teacher with this email already exists");
        };
        const teacher = await Teacher.create({
            firstName,
            lastName,
            email,
            phone,
            Speacialization
        });
        return sendSUCCESS(res, 201,"Teacher created successfully", teacher)
    } catch (error) {
        console.error("Create teacher error: ", error);
        return sendError(res, 500, "Failed to create teacher", error.message);
    };
};


//GET all teachers
const getTeachers = async(req, res)=>{
    try {
        const teachers = await Teacher.find().sort({createdAt:-1});
        return sendSUCCESS(res, 200,"Teacher fetched successfully", teachers);
    } catch (error) {
        console.error("Fetch teacher error: ", error);
        return sendError(res, 500, "Failed to fetch teacher", error.message);
    };
};


//TO-DO:Get single teacher, update teacher, delete teacher


//GET  a single teacher
const getSingleTeacher = async(req, res)=>{
    try {
        const {id}= req.params;
        const teacher = await Teacher.findById(id);
        if(!teacher){
            return sendError(res, 404, "Teacher not found");
        }
        return sendSUCCESS(res, 200,"Teacher fetched successfully", teacher);
    } catch (error) {
        console.error("Fetch teacher error: ", error);
        return sendError(res, 500, "Failed to fetch teacher", error.message);
    };
};




//UPDATE teacher
const updateTeacher = async (req, res)=>{
    try {
        const {id } = req.params;
        const teacher = await Teacher.findByIdAndUpdate(id, req.body, {new:true, runValidators:true});
        if(!teacher){
            return sendError(res, 404, "Teacher not found");
        }
        return sendSUCCESS(res, 200,"Teacher updated successfully", teacher);
    } catch (error) {
        console.error("Update teacher error: ", error);
        return sendError(res, 500, "Failed to update teacher", error.message);
    };
};



//DELETE teacher
const deleteTeacher = async(req, res)=>{
    try {
        const {id}= req.params;
       await Course.updateMany({teacher: id}, {$set: {teacher:null}});

       const teacher = await Teacher.findByIdAndDelete(id);
       if(!teacher){
            return sendError(res, 500, "Failed to delete teacher");
       }
        return sendSUCCESS(res, 200,"Teacher deleted successfully");

    } catch (error) {
        console.error("Fetch teacher error: ", error);
        return sendError(res, 500, "Failed to fetch teacher", error.message);
    };
}

export {createTeacher, getTeachers, getSingleTeacher, updateTeacher, deleteTeacher}