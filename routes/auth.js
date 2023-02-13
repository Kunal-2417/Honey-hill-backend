import express from "express";
const router = express.Router();
import bcrypt from'bcryptjs';
import User from "../models/User.js";
// import window from 'global';

// localStorage = window.localStorage;


import createError from"../utils/error.js";
import jwt  from 'jsonwebtoken';

router.get("/", (req, res) => {
    res.send("User end point");
})


// REGISTRATION
router.post("/register", async (req, res, next) => {
    try {
        const salt =await bcrypt.genSaltSync(10);
        const hash =await bcrypt.hashSync(await req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password: hash
        })

        await newUser.save();
        res.status(200).send("User profile created successfully")
    } catch (error) {
        next(error);
    }
})

// LOGIN
router.post("/login", async (req, res, next) => {
    try {

        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return next(createError(404, "user not found"))
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) {
            return next(createError(404, "Invalid username or password"))
        }


        //TOKEN
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT)
        // user.token = token; // save user token
        const options = {
            httpOnly: true,
        }
       


        const { password, isAdmin, ...otherdetails } = user._doc;   //To avoid showing password on api request 
        res.cookie('token',token,options).status(200).json({details:{...otherdetails},isAdmin }).send(token);
    } catch (error) {
        next(error);
    }
})


export default router;