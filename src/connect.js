const mongoose = require("mongoose"); 

mongoose.connect("mongodb://localhost:27017/toDoList", { 
    //useCreateIndex : true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then(() => {
    console.log("CONNECTION BUILD"); 
    }).catch((err) => {
    console.log(err); 
    });