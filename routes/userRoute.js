const express=require("express");
const { UserModel } = require("../models/userModel");
const bcrypt=require("bcrypt")
const {checkRole}=require("../middleware/authorization")
const jwt=require("jsonwebtoken");
const { authentication } = require("../middleware/authentication");
const userRoute=express.Router();
require("dotenv").config()

userRoute.get("/all",async(req,res)=>{
    try {
        const data= await UserModel.find()
        res.send(data)
    } catch (error) {
        res.send({err:error.message})
        
    }
})
userRoute.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const database = await UserModel.find({ email });
        if (database.length > 0) {
            res.status(400).json({ message: "User already exists" });
        } else {
            bcrypt.hash(password, 8, async (err, hash) => {
                if (err) {
                    res.status(401).send({ "error": err.message })
                } else {
                    const user = new UserModel({ name, email, password: hash, role })
                    await user.save()
                    res.status(200).send({ "msg": "user created successful" })

                }
            });
        }
    } catch (error) {
        res.status(401).send({ "error": error.message })

    }
})

userRoute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.find({ email });
        // console.log(user[0].password);
        bcrypt.compare(password, user[0].password, (err, result) => {
            if (result) {
                var token = jwt.sign({ userId: user[0]._id }, process.env.accessKey, { expiresIn: "1m" });
                var reftoken = jwt.sign({ userId: user[0]._id }, process.env.refreshKey, {
                    expiresIn: "5m"
                });
                res.cookie("token", token)
                res.cookie("reftoken", reftoken)
                res.status(200).json({ "success": "login successful", token })
            } else {
                res.status(401).json({ "err": "wrong credential" })
            }
        });



    } catch (err) {
        res.status(400).json({ err: err.message })

    }
})

userRoute.get("/logout", async (req, res) => {
    try {
        const token = req.cookies.token;
        const block = new BlockModel({ token })
        block.save();
        res.status(200).json({ "success": "user blocklisted" })

    } catch (error) {
        res.status(401).json({ 'error': error.message })

    }
})

userRoute.delete("/delete/:id", authentication, checkRole(["seller"]), async (req, res) => {
    try {
        const id = req.params.id
        // console.log(id);
        await UserModel.findByIdAndDelete({ _id: id })
        res.send("name")
        // res.status(200),send({"success":"delete success",data})
    } catch (error) {
        res.status(401), json({ "err": error.message })

    }
})
userRoute.get("/refresh", async (req, res) => {
    try {
        // const reftoken=req.headers.authorization?.split(" ")[1];
        const reftoken = req.cookies.reftoken
        // console.log(reftoken);


        var decoded = jwt.verify(reftoken, process.env.refreshKey);
        if (decoded) {
            var token = jwt.sign({ userId: decoded.userId }, process.env.accessKey, { expiresIn: "1m" });
            res.cookie("token", token)
            res.status(200).json({ token })
        } else {
            res.status(401).json({ err: "wrong credential" })
        }

    } catch (error) {
        res.status(401).json({ "err": error.message })

    }
})

module.exports={userRoute}