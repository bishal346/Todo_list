const express = require("express"); 
const { TopologyType } = require("mongodb");
const path = require("path"); 
const bcrypt = require("bcryptjs");
const hbs = require("hbs"); 
//const fast2sms = require("fast-two-sms");   
const client = require("twilio")('AC27d99c311a7c92a8ce032a14115f93f6', '2e9bc387acfff9db5551334938ce7829'); 

require("./src/connect"); 
const todo = require("./src/signIn"); 
const app = express(); 
app.set("view engine", "hbs"); 
app.set("views",path.join(__dirname,"/template/views")); 
app.use(express.urlencoded({extended : false})); 
hbs.registerPartials(path.join(__dirname,"/template/partials")); 

let eml = "";  
let otp = 0; 
let name = ""; 

app.get("/", (req,res) => {
    eml = ""; 
    otp = 0; 
    name = ""; 
    res.render("Home"); 
    //res.send("HELLO BISHAL"); 
});
app.get("/SignIn", (req,res) => {
    res.render("SignIN", {
        message : "Please fill up all the details"
    }); 
    //res.send("HELLO BISHAL"); 
}); 
app.post("/SignIn", async (req,res) => {
    // const data = new todo({

    // })
    try {
        if(!req.body.name||!req.body.email||!req.body.phone||!req.body.password) {
            res.render("SignIN", {
                message : "Please fill up all the details"
            }); 
        }; 
        eml = req.body.email;
        const data = new todo({
            name : req.body.name, 
            email : req.body.email.toLowerCase(), 
            phone : req.body.phone, 
            password : req.body.password 
        }); 
        const arr = await data.save(); 
        const x = Math.floor(Math.random()*1000); 
        if(x<1000) {
            otp = 1000 + x; 
        }
        else {
            otp = x; 
        }
        name = req.body.name; 
        client.messages.create({
            body: `HELLO ${req.body.name} YOU ONE TIME OTP IS ${otp}`,
            to: `+91${req.body.phone}`,
            from: '+19146859161'
         }).then(message => console.log(message)).catch(error => console.log(error))
        console.log("SMS SENT ! "); 
        console.log(arr); 
        //res.send(arr); 
        eml = req.body.email; 
        console.log(eml); 
        res.render("Verify", {
            message : ""
        });
        //res.send("SUCESSFULLY Registered")
    }
    catch(err) {
        console.log(err); 
        res.render("SignIN", {
            message : "Invalid Details"
        }); 
    }
}); 
app.get("/LogIN", (req,res) => {
    res.render("LogIn", {
        message : ""
    }); 
}); 
app.post("/LogIN", async (req,res) => {
    try{
        const emailId = req.body.email; 
        const pass = req.body.password; 
        const brr = await todo.find({email : emailId.toLowerCase()}); 
        console.log(brr[0]);
        const check = await bcrypt.compare(pass,brr[0].password); 
        console.log(check); 
        if(!check) {
            res.render("LogIn",{
                message : "Invalid LogIN Details."
            });  
        }
        else {
            name_a = brr[0].name; 
            eml = brr[0].email;
            res.render("welcome", {
                name : name_a
            }); 
        }
    //const arr = await data.save(); 
        //console.log(arr); 
        //res.send(arr); 
    }
    catch(err) {
        console.log(err);
        res.render("LogIn",{
            message : "Invalid LogIN Details. Please Check Details"
        }); 
    }
})
app.post("/verify", async (req,res) => {
    if(req.body.otp==otp) {
        res.render("welcome", {
            name : name
        }); 
    }
    else {
        //eml = "";
        console.log("Invalid OTP"); 
        const arr = await todo.deleteOne({email : eml}); 
        res.render("Verify", {
            message : "Invalid OTP"
        });
    }
}); 
app.get("/users/About", (req,res) => {
    res.render("About"); 
}); 
app.get("/users/Insert", (req,res) => {
    res.render("date_inst", {
        message : ""
    }); 
});
app.post("/users/Insert", async (req,res) => {
    try {
        const obj = {
            work : req.body.work,
            day : req.body.date.toString()
        }
        let arr = await todo.find({email : eml}); 
        console.log(arr);
        console.log(arr);
        const brr = arr[0].todo; 
        brr.push(obj); 
        arr = await todo.updateOne({email : eml},{$set : {todo : brr}}); 
        // console.log("NOT ITI")
        // res.send("NOT"); 
        res.render("date_inst", {
            message : "Sucessfull"
        });
    }
    catch(err) {
        console.log(err);
        res.render("date_inst", {
            message : "Invalid"
        });
    }
    
    //res.render("date_inst"); 
});
app.get("/users/Update", (req,res) => {
    res.render("date_updt", {
        message : ""
    }); 
});
app.post("/users/Update", async (req,res) => {
    const date = req.body.date.toString(); 
    let arr = await todo.find({email : eml});
    let brr = arr[0].todo; 
    let t = false;
    for(let i = 0; i<brr.length; i++) {
        if(brr[i].day === date) {
            brr[i].work = req.body.work; 
            t = true; 
            break; 
        }
    }
    let mes = "Sucessful";
    if(t==false) {
        // res.render("date_updt", {
        //     message : "Invalid"
        // });   
        mes = "Invalid Request"   
    }
    arr = await todo.updateOne({email : eml},{$set : {todo : brr}}); 
    // console.log("NOT ITI")
    // res.send("NOT");  
    res.render("date_updt", {
        message : mes
    }); 
});
app.get("/users/find", async (req,res) => {
    try {
        const arr = await todo.find({email : eml}); 
        res.render("date_find", {
            arr : arr[0].todo
        })
    }
    catch(error) {
        res.render("NULL_ERROR");
    }
}); 
app.get("/users/Delete", (req,res) => {
    res.render("date_del", {
        message : ""
    }); 
});
app.post("/users/Delete", async (req,res) => {
    const date = req.body.date.toString(); 
    let arr = await todo.find({email : eml});
    let brr = arr[0].todo; 
    let t = false;
    for(let i = 0; i<brr.length; i++) {
        if(brr[i].day === date) {
            brr.splice(i,1); 
            t = true; 
            break; 
        }
    }
    let mes = "Sucessful";
    if(t==false) {
        mes = "INVALID !"
    }
    arr = await todo.updateOne({email : eml},{$set : {todo : brr}}); 
    // console.log("NOT ITI")
    // res.send("YES DELETE HOE GACHE") ; 
    res.render("date_del", {
        message : mes
    });
});
app.get("/find", async (req,res) => {
    const arr = await todo.find({}); 
    res.send(arr); 
});
app.get("/del", async (req,res) => {
    const arr = await todo.deleteOne({email : "naden@gmail.com"}); 
    res.send(arr); 
}); 
app.get("/updt", async (req,res) => {
    const arr = [{work : "Meeting", day : "Tuesday"},{work : "Project", day : "Monday"},{work : "Tour", day : "Friday"}]
    const brr = await todo.updateOne({email : "bishal@gmail.com"},{$set : {todo : arr}}); 
    res.send(brr); 
})
app.get("/Sundar", async (req,res) => { 
    const obj = {
        authorization : 'hZjxly012tcXpTvdmBrK5fA6ORGqnFPLV4H9IJaCS7WDbMskYoUadW2KIhnXvLiDSYrpM1wG98PFTb7A', 
        message : 'Hello Bishal Your OTP CODE is 9630', 
        number : ['7908683953']
    }
    fast2sms.sendMessage(obj).then((response) => {
        console.log(response);   
        res.send(response);
    }).catch((error) => {
        console.log(error);   
        res.send(error); 
    }); 
    //console.log(ans);   
    //res.send(ans); 
}); 
app.listen(8000, () => {
    console.log("LISTENING TO 8000 PORT"); 
})
