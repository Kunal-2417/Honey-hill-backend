import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter         from "./routes/auth.js";
import userRouter         from "./routes/user.js";
import hotelRouter        from "./routes/hotel.js";
import hotelroomRouter    from "./routes/hotelroom.js";


const app=express();
dotenv.config();




const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO);
        console.log("Connect to mongobd");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected")
})



// MIDDLEWARE 

app.use(express.json());
app.use(cookieParser())
app.use(cors())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/hotel", hotelRouter)
app.use("/api/hotelroom", hotelroomRouter)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    }
    )
})


app.listen(8800, ()=>{
    connect();
    console.log("CONNECTED TO BECKEND");
})
