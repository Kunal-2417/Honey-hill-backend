import express from "express";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { isAdmin } from "../utils/verifytoken.js";



const router = express.Router();

router.get("/", (req, res) => {
    res.send("User end point");
})


 

// CREATE
router.post("/create/:hotelid", async (req, res,next) => {
    const hotelid = req.params.hotelid;
    const newroom = new Room(req.body);

    try {
        const savedRoom = await newroom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelid, {
                $push: { rooms: savedRoom._id }
            });
        } catch (error) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (error) {
        next(err)
    }
})

// UPDATE
router.put("/update/:id", isAdmin, async (req, res, next) => {
    try {
        const UpdateRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(UpdateRoom);
    } catch (error) {
        next(error);
    }
})
// DELETE
router.delete("/delete/:id/:hotelid",isAdmin,  async (req, res, next) => {
    const hotelid = req.params.hotelid;

    try {
            await Room.findByIdAndDelete(req.params.id)
        try {
            await Hotel.findByIdAndUpdate(hotelid, {
                $pull: { rooms: req.params.id }
            });
        } catch (error) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (error) {
        next(err)
    }
})

// GET
router.get("/get/:id", async (req, res, next) => {
    // const failed = true;
    // if (failed) return next(createError(401, "aa gye hum error lekar"))
    try {
        const room = await Room.findById(req.params.id)
        res.status(200).json(room);
    } catch (error) {
        next(error);
    }
})
// GET ALL
router.get("/get", async (req, res) => {


    try {
        const rooms = await Room.find(req.params.id)
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json(error)
    }
})

//SELECT ROOM
router.put("/bookroom/:id",async(req,res)=>{
    try {
        const bookRoom = await Room.updateOne(
            {"roomNumbers._id":req.params.id},
             {
                 $push:{
                    "roomNumbers.$.unavailableDates":req.body.dates
                 }
            }, { new: true })
        res.status(200).json("Room Booked Successfully!");
    } catch (error) {
        next(error);
    }
})

export default router;