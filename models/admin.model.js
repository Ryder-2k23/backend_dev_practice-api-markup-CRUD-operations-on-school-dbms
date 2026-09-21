import { mongoose } from "mongoose";

const adminSchema = new mongoose.Schema({
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
    },


    //Authentication account
    user:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         default:null
    }

}, {timesatamps: true});


const Admin = mongoose.model("Admin", adminSchema);

export default Admin;