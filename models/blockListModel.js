const mongoose=require('mongoose')

const blockSchema=mongoose.Schema({
    token:{type:String,required:true}
})
const BlockModel=mongoose.model("block",blockSchema);
module.exports={BlockModel}