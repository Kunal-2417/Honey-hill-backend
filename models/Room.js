import mongoose from'mongoose';
const { Schema } = mongoose;


const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    maxPeople: {
        type: Number,
        require: true
    },
    disc: {
        type: String,
        require: true
    },
   
    roomNumbers: [{number:Number ,unavailableDates:{type:[Date]}}],
},{timestamps:true})

// module.exports=HotelSchema;
export default mongoose.model("Room", RoomSchema)