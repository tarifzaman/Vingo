import mongoose from "mongoose"

const userScema = new mongoose.Schema({
    fullname:{
        type: String,
        reuqired: true
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    password:{
        type: String,
    },
    mobile:{
        type : String,
        required : true,
    },
    role:{
        type : String,
        enum:["user","owner","deliveryBoy"],
        required : true
    }
},{timestamps:true})

const User = mongoose.model("User",userScema)

export default User