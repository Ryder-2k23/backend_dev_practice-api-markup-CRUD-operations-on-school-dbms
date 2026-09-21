import express from "express";
import { registerStudent,registerTeacher, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/student-signup", registerStudent);
router.post("/teacher-signup",  registerTeacher);
router.post("/login",  login);

export default router;