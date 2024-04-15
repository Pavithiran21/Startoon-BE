import mongoose from "mongoose";
const {Schema} = mongoose;
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
    },
    
    isAdmin:{
        type:Boolean,
        default:false
    },
    count:{
        type:Number,
    },
    LastLoginDate:{
        type:Date
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },  
},
{
    timestamps: true
});

export default mongoose.model('users', UserSchema);

