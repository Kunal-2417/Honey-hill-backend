import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors"
import authRouter         from "./routes/auth.js";
import userRouter         from "./routes/user.js";
import hotelRouter        from "./routes/hotel.js";
import hotelroomRouter    from "./routes/hotelroom.js";
import cookieParser from "cookie-parser";


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
app.use(cookieParser());
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
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://honeyhilltry.onrender.com"); // replace with your frontend domain
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.listen(process.env.Port, ()=>{
    connect();
    console.log("CONNECTED TO BECKEND");
})
