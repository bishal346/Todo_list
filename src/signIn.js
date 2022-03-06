const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs"); 


const signSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : true, 
        trim : true
    }, 
    email : {
        type : String, 
        required : true, 
        unique : true, 
        trim : true
    }, 
    phone : {
        type : Number, 
        required : true
    }, 
    password : {
        type : String, 
        required : true 
        //trim : true
    }, 
    todo : [{
        work : {
            type : String
        }, 
        day : {
            type : String
        }
    }]
})

signSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next(); 
})

const signin = new mongoose.model("signin", signSchema); 

console.log("SUCESSFULLY EXECUTED TODO"); 

module.exports = signin; 