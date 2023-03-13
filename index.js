const express=require("express")
const app=express();
require("dotenv").config()
const cors=require("cors");
const cookieParser=require("cookie-parser");
const { connection } = require("./db");
app.use(cors())
app.use(express.json());

app.use(cookieParser())
const {userRoute}=require("./routes/userRoute");
const { authentication } = require("./middleware/authentication");
const { productRoute } = require("./routes/productRoute");
app.get("/",(req,res)=>{
    res.send("home page")
})
app.use("/users",userRoute)
app.use(authentication)

app.use("/products",productRoute)

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log(`server is running at port ${process.env.port}`);
    } catch (error) {
        console.log(error);
        
    }
})