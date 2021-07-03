//import packages
const express = require("express")
const mongoose = require("mongoose")

//app config
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs');

//db config
const customerschema = mongoose.Schema({
    name:String,
    email:String,
    balance:Number
})
const model = mongoose.model("customerData",customerschema)

mongoose.connect("mongodb+srv://nikhilbabu614:Nikhil123@cluster0.gzbjn.mongodb.net/bankDB?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true })

//api routes
app.get("/",(req,res)=>{
    res.render("pages/home")
})

app.get("/customers",(req,res)=>{
    model.find((err,data)=>{
        res.render("pages/customers",{data:data})
    })
})

app.post("/profile",(req,res)=>{
    const username = req.body.cname;
    model.find((err,data)=>{
        for(var i =0 ;i<data.length;i++){
            if(data[i].name === username){
                data = data[i]
            }
        }
        res.render("pages/profile",{data:data})
    })
})

app.post("/transfer",(req,res)=>{
    const username = req.body.cname;    
    model.find((err,data)=>{
        for(var i =0 ;i<data.length;i++){
            if(data[i].name === username){
                data = data[i]
            }
        }
        res.render("pages/transfer",{data:data})
    })
})


app.post("/transaction",(req,res)=>{
    const username = req.body.cname;    
    model.find((err,data)=>{
        for(var i =0 ;i<data.length;i++){
            if(data[i].name === username){
                mydata = data[i]
            }
        }
        res.render("pages/transaction",{data:mydata , amount:req.body.amount , userdata:data})
    })
})

app.post("/send",(req,res)=>{
    const sender = req.body.sender;
    const amount = req.body.amount;
    const reciever = req.body.reciever;
    model.find((err,data)=>{
        for(var i =0 ;i<data.length;i++){
            if(data[i].name === sender){
                model.findOneAndUpdate({name:sender},{balance:data[i].balance - parseInt(amount)},(err,data)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(data)
                    }
                })
            }

            if(data[i].name === reciever){
                model.findOneAndUpdate({name:reciever},{balance:data[i].balance + parseInt(amount)},(err,data)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(data)
                    }
                })
            }
        }
    })

    res.redirect("/customers")
})




//server
app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at port 3000`)
  })