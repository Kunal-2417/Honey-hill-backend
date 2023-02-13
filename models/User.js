import mongoose from 'mongoose';
// const { Schema } = mongoose;


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique:true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    img:{
        type:String
    },
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
 

},{timestamps:true})

// module.exports=HotelSchema;
export default mongoose.model("User", UserSchema)