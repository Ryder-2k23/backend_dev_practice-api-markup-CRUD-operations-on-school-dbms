import Course from "../models/courses.model.js";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";

import { sendSUCCESS, sendError } from "../utils/response.js";

// CREATE course
const createCourse = async(req, res)=>{
    try {
        const { name, course_code, description, teacher } = req.body;

        const existingCourses = await Course.findOne({course_code: course_code.toUpperCase()});

        if(existingCourses){
            return sendError(res, 409, "A course with this code already exists");
        };

        // check for teacher existence
        const existingTeacher = await Teacher.findById(teacher);
        if(!existingTeacher){
            return sendError(res, 404, "Teacher not found")
        }

        //create course if all is good
        const course = await Course.create({
           name,
           course_code,
           description,
           teacher
        });

        // creating a relatioship btw two tables
        const populatedCourse = await Course.findById(course._id).populate(
            "teacher", "firstName lastName email Speacialization"
        )
      
        
        return sendSUCCESS(res, 201,"Course created successfully", course)
    } catch (error) {
        console.error("Create course error: ", error);
        return sendError(res, 500, "Failed to create course", error.message);
    };
};


//GET all courses
const getCourses = async(req, res)=>{
    try {
        const courses = await Course.find().populate('teacher', "firstName lastName email Speacialization").populate("students", "firstName lastName phone").sort({createdAt: -1});

        return sendSUCCESS(res, 200,"Courses fetched successfully", courses);
    } catch (error) {
        console.error("Get course error: ", error);
        return sendError(res, 500, "Failed to get course", error.message);
    };
};



// GET single course 
const getSingleCourse = async(req, res)=>{
    try {
        const {id} = req.params;
        const course = await Course.findById(id).populate("teacher", "firstName lastName email Speacialization").populate("students", "firstName lastName email");
        if(!course){
            return sendError(res, 404, "Course not found");
        };
         return sendSUCCESS(res, 200, "Course fetched successfully", course)
    }catch (error) {
        console.error("Get course error: ", error);
        return sendError(res, 500, "Failed to get single course", error.message);
    };
};



//update course
const updateCourse = async(req, res)=>{
    try {
        const {id} = req.params;
        // stating what must be updated
        const {name, course_code, description, teacher }= req.body;

        // checking if teacher exists 
        if(teacher){
            const teacherExists = await Teacher.findById(teacher);
            if(!teacherExists){
                return sendError(res, 404, "Teacher not found")
            }
        };

        const updateData = {
            name, description
        };
        //if any of this is mentioned add to the object
        if(course_code){
            updateData.course_code = course_code.toUpperCase();
        };
        if(teacher){
            updateData.teacher = teacher;
        };

     const course = await Course.findByIdAndUpdate(id, updateData, {new:true,runValidators:true}).populate("teacher", "firstName lastName email Speacialization").populate("students", "firstName lastName email");
     if(!course){
        return sendError(res, 404, "Course nt found");
     };
     return sendSUCCESS(res, 200, "Course updated successfully");
    
    } catch (error) {
        console.error("Update course error: ", error);
        return sendError(res, 500, "Failed to update single course", error.message);
    };
}


//DELETE course
const deleteCourse = async(req, res)=>{
    try {
        const {id} = req.params;
        const course_id = await Course.findByIdAndDelete(id);
        if(!course_id){
           return sendError(res, 404, "Failed to delete course"); 
        }
        return sendSUCCESS(res, 200, "Course deleted successfully");
    } catch (error) {
        console.error("Get course error: ", error);
        return sendError(res, 500, "Failed to get single course", error.message);
    };
};


// Enroll students assign student to course(s)
const enrollStudent = async(req, res)=>{
    try {
        //send to prarams
        const {id} = req.params;
        //sending to the body
        const {student_id} = req.body;

        const course = await Course.findById(id);
        if(!course){
           return sendError(res, 404, "Course not found"); 
        };


        const student = await Student.findById(student_id);
        if(!student){
           return sendError(res, 404, "Student not found"); 
        };

        //check if student is already enrolled in the course
        //go into the students field, check by the id to know if enrolled
        const alreadyEnrolled = course.students.some((student)=>student.toString() === student_id);

        if(alreadyEnrolled){
           return sendError(res, 409, "Student is already enrolled in this course");
        };

        course.students.push(student_id);
        await course.save();

        const updateCourse = await Course.findById(course._id).populate("teacher", "firstName lastName email Speacialization").populate("students", "firstName lastName email");
        return sendSUCCESS(res, 200, "Course enrolled successfully", updateCourse);
    } catch (error) {
        console.error("Course enrollment error: ", error);
        return sendError(res, 500, "Failed to enroll course", error.message);
    };
};


//Remove student from course
const removeStudent = async(req, res)=>{
    try {
        //send to prarams
        const {id} = req.params;
        //sending to the body
        const {student_id} = req.body;

        const course = await Course.findById(id);
        if(!course){
           return sendError(res, 404, "Course not found"); 
        };


        const student = await Student.findById(student_id);
        if(!student){
           return sendError(res, 404, "Student not found"); 
        };

        //check if student is already enrolled in the course
        //go into the students field, check by the id to know if enrolled
        const studentExists = course.students.some((student)=>student.toString()=== student_id);

        if(!studentExists){
           return sendError(res, 409, "Student is not enrolled in this course");
        };

        course.students= course.students.filter((student)=>student.toString()!== student_id);
        await course.save();

        const updateCourse = await Course.findById(course_id).populate("teacher", "firstName lastName email Speacialization").populate("students", "firstName lastName email");
        return sendSUCCESS(res, 200, "Course removed successfully", updateCourse);
    } catch (error) {
        console.error("Remove student error: ", error);
        return sendError(res, 500, "Failed to remove course", error.message);
    };
};

// Get courses under a teacher
const courseUnderTeacher = async(req, res)=>{
    try {
        const {id} = req.params;

        const teacher = await Teacher.findById(id);
        if(!teacher){
            return sendError(res, 404, "No teacher available");
        }

        const courses = await Course.find({teacher: id}).populate("teacher", "firstName lastName email Speacialization");
        
        return sendSUCCESS(res, 200, "Course fetched successfully", courses);
    } catch (error) {
        console.error("Get course error: ", error);
        return sendError(res, 500, "Failed to get course under teacher", error.message);
    };
}



//Get students enrolled in a course
const getStudentEnrolled = async(req, res)=>{
    try {
        const {id} = req.params;
        const course = await Course.findById(id).populate("students", "firstName lastName phone");
        if(!course){
            return sendError(res, 404, "Course does not  exist");
        }
        
        return sendSUCCESS(res, 200, "Students fetched successfully", course.students);
    }  catch (error) {
        console.error("Get student error: ", error);
        return sendError(res, 500, "Failed to get students under course", error.message);
    };
}


export {createCourse,getStudentEnrolled, getCourses, getSingleCourse, updateCourse, deleteCourse, enrollStudent, removeStudent, courseUnderTeacher}