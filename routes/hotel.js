import express from "express";
import Hotel from"../models/Hotel.js";
import Room from "../models/Room.js";
import { isAdmin } from "../utils/verifytoken.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("User end point");
})


// CREATE
router.post("/create",isAdmin,  async (req, res) => {
    const newHotel = new Hotel(req.body)

    try {
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel);
    } catch (error) {
        res.status(500).json(error)
    }
})

// UPDATE
router.put("/update/:id", isAdmin, async (req, res, next) => {
    try {
        const UpdateHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(UpdateHotel);
    } catch (error) {
        next(error);
    }
})
// DELETE
router.delete("/delete/:id",isAdmin, async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json("Hotel deleted successfully");
    } catch (error) {
        next(error);
    }
})

// GET
router.get("/get/:id", async (req, res, next) => {
    // const failed = true;
    // if (failed) return next(createError(401, "aa gye hum error lekar"))
    try {
        const hotel = await Hotel.findById(req.params.id)
        res.status(200).json(hotel);
    } catch (error) {
        next(error);
    }
})
// GET ALL
router.get("/get", async (req, res) => {
    const {min,max,...other}=req.query
    try {
        // const limits=3
        // const hotels = await Hotel.find({...other,cheapestPrice:{$lt:min ||1,$lt:max||999}});
        const hotels = await Hotel.find({});

        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json(error)
    }
})
// SEarch city hotel
router.get("/getall", async (req, res) => {


    try {
        const hotels = await Hotel.find({})
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get by city name
router.get("/countByCity", async (req, res) => {
    const cities = req.query.cities.split(",");
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city });
        }))
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json(error)
    }  
})

//Hotel price
router.get("/pricelist", async (req, res,next) => {
    try {
        const limits=4;
        const hotel = await Hotel.find(req.params.id).limit(limits)
        res.status(200).json(hotel);
    } catch (error) {
        next(error);
    }
})

//HOTEL ROOM 
router.get("/room/:id", async (req, res,next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        const list= await Promise.all(hotel.rooms.map((room)=>{
            return Room.findById(room);
        }));
        res.status(200).json(list);
    } catch (error) {
        next(error);    
    }
})

// get all rooms
router.get("/getallrooms", async (req, res) => {


    try {
        const hotel = await Hotel.find({});
        const list = await Promise.all(hotel.rooms.map((room) => {
            return Room.findById(room);
        }));
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get by type
router.get("/countByType", async (req, res) => {
    try {
    const hotelcount=await Hotel.countDocuments({type:'Hotel'})
    const Resortcount =await Hotel.countDocuments({ type: 'Resort' })
    const TinyHousecount =await Hotel.countDocuments({ type: 'Tiny house' })
    const StupaGuestcount =await Hotel.countDocuments({ type: 'Stupa Guest house' })
    res.status(200).json([
        {type:"hotel",count:hotelcount},
        { type: "Resort", count: Resortcount },
        { type: "Tiny house", count: TinyHousecount},
        { type: "Stupa Guest house", count: StupaGuestcount}

    ]);
    } catch (error) {
        res.status(500).json(error)
    }
})


export default router;