import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
    type: String,
    required: [true, "Email is required"],
    trim:true,
    unique:true,
    lowercase:true,
},
password:{
    type: String,
    required: [true, "Password is required"],
    minlength:[6, "Password must be at least 6 characters"],
    select:false,
},
role:{
    type: String,
    required:[true, 'Role is required'],
    enum:['admin', 'teacher', 'student'],
    lowercase: true
},
students:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Student",
    default: null
},
teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    default:null
},
admin:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Admin",
    default:null
}
}, {timestamps:true});

const User = mongoose.model("User", userSchema);

export default User