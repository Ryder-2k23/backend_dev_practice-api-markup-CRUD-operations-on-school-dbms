import { mongoose } from "mongoose";

const teacherSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: [true, "First name is required"],
        trim:true
    },
    lastName:{
        type:String,
        required: [true, "Last name is required"],
        trim:true
    },
    email:{
        type:String,
        required: [true, "Email name is required"],
        trim:true,
        unique: true,
        lowercase:true
    },
    phone:{
        type:String,
        required: [true, "First name is required"],
        trim:true
    },
    Speacialization:{
        type:String,
        trim:true
    },
    qualification:{
        type:String,
        trim:true
    },
    profile_Image:{
        type:String,
        default:null
    }

}, {timesatamp: true});


const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;