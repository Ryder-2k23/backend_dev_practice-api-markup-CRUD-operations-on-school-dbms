import mongoose from "mongoose";


const studentSchema = new mongoose.Schema({
firstName:{
    type: String,
    required: [true, "First name is required"],
    trim:true
},
lastName:{
    type: String,
    required: [true, "Last name is required"],
    trim:true
},
email:{
    type: String,
    required: [true, "Email is required"],
    trim:true,
    unique:true,
    lowercase:true,
},
phone:{
    type: String,
    required: [true, "Phone number is required"],
    trim:true,
    unique:true,
},
dob:{
    type: Date,
},
gender:{
    type: String,
    enum: ["male", "female", "Others"],
    lowercase: true 
},
address:{
    type: String,
    trim:true
},
profile:{
    type: String,
    default: null
},

//Authentication account
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default:null
}
}, {timestamps:true})

const Student = mongoose.model("Student", studentSchema);
export default Student;