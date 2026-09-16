import express from "express";
import { getStudentEnrolled,enrollStudent,courseUnderTeacher, removeStudent, createCourse, getCourses, getSingleCourse, updateCourse,deleteCourse } from "../controllers/course.controller.js";

const router = express.Router();

router.post("/", createCourse);
router.get("/",  getCourses);
router.get("/:id", getSingleCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

router.post("/:id/students", enrollStudent)//student enrollment
router.delete("/:id/students", removeStudent)//student removal
router.get("/teachers/:id/courses", courseUnderTeacher); //to view courses under a teacher
router.get("/:id/students", getStudentEnrolled) //get all students from a course
export default router;