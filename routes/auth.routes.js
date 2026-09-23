import express from "express";
import { registerAdmin, registerStudent,registerTeacher, login, profile } from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"
const router = express.Router();

router.post("/student-signup", registerStudent);
router.post("/teacher-signup",  registerTeacher);
router.post("/admin-signup", registerAdmin)
router.post("/login",  login);
router.get("/profile",authMiddleware, profile);

export default router;