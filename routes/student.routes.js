import express from "express";
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from "../controllers/student.controller.js";

const router = express.Router();


// POST /api/students
router.post("/", createStudent);


// GET /api/students
router.get("/", getStudents);

// GET /api/students/:id
router.get("/:id", getStudent)

// PUT /api/students/:id
router.put("/:id", updateStudent)

// DELETE /api/students/:id
router.delete("/:id", deleteStudent)

export default router;