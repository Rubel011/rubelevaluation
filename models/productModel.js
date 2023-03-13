const mongoose=require("mongoose");
const productSchema=mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true}
})

const ProductModel=mongoose.model("product",productSchema)

module.exports={ProductModel}