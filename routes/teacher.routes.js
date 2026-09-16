import  express  from "express";
import { deleteTeacher, createTeacher, getTeachers, getSingleTeacher, updateTeacher } from "../controllers/teacher.controller.js";


const router = express.Router();

router.post("/", createTeacher);
router.get("/",  getTeachers);
router.get("/:id", getSingleTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher)

export default router;