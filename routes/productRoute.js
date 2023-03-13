const express=require("express")
const { checkRole } = require("../middleware/authorization");
const { ProductModel } = require("../models/productModel");
const productRoute=express.Router()

productRoute.get("/",async(req,res)=>{
    try {
        const data= await ProductModel.find()
        res.send(data)
    } catch (error) {
        res.send(error)
        
    }
})

productRoute.post("/addproducts",checkRole(["seller"]),async(req,res)=>{
    let post= req.body;
    try{
        const product= new ProductModel(post)
        await product.save()
        res.send("New product has been added")
    }catch(err){
        res.send({"msg":"something went wrong","error":err.message})
    }
})

productRoute.delete("/deleteproducts/:id",checkRole(["seller"]),async(req,res)=>{
    let id= req.params.id;
    try{
        await ProductModel.findByIdAndDelete({"_id":id})
        res.send(`Delete the user whose id is${id}`)
    }catch(err){

    }
})

module.exports={productRoute}