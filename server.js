import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import courseRoutes from "./routes/course.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config()

const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))

//ROUTES
app.use("/api/students", studentRoutes);
app.use(errorMiddleware);
app.use("/api/teachers",teacherRoutes );
app.use("/api/courses", courseRoutes);

connectDB()
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`SERVER RUNNING  ON PORT ${PORT}`));