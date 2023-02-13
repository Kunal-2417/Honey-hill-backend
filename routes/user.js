import express from "express";
import User from"../models/User.js";

import { verifytoken, isAdmin, verifyuser } from "../utils/verifytoken.js";



const router =express.Router();

router.get("/", (req, res) => {
    res.send("User end point");
})

router.get("/checkauthentication",verifytoken, (req, res, next) => {
    res.send("kunal")
})

// UPDATE
router.put("/update/:id", verifyuser, async (req, res, next) => {
    try {
        const UpdateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(UpdateUser);
    } catch (error) {
        next(error);
    }
})
// DELETE
router.delete("/delete/:id", verifyuser,  async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted successfully");
    } catch (error) {
        next(error);
    }
})

// GET
router.get("/get/:id", verifyuser,  async (req, res, next) => {
    // const failed = true;
    // if (failed) return next(createError(401, "aa gye hum error lekar"))
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
})
// GET ALL
router.get("/get",isAdmin,  async (req, res) => {


    try {
        const users = await User.find(req.params.id)
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error)
    }
})


export default router;