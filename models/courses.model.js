import { mongoose } from "mongoose";

const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Course name is required"],
        trim:true
    },
    course_code:{
        type:String,
        required: [true, "Course code is required"],
        unique:true,
        uppercase:true,
        trim:true
    },
    description:{
        type:String,
        trim:true,
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        default:null
    },
    students:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }
    ]

}, {timesatamp: true});


const Course = mongoose.model("Course", courseSchema);

export default Course;