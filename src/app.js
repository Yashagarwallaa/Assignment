const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ 
    extended:false
}))

app.get('/',function(req,res){
     res.sendFile('index.html');
}).listen(3000);

console.log("Listening on PORT 3000");

const uri = "mongodb+srv://yashagarwalla001:S8hKrEU2GP320Cko@dataset.nnn25bz.mongodb.net/sampledata";
//connecting the database to mongodb atlas
mongoose.connect(uri,
   {useNewUrlParser : true}, 
   {useUnifiedTopology : true}
).then(() => {
    console.log("Connected To Database");
}).catch((err) => {
    console.log("Error in connecting to database", err);
});

const mySchema = {
  id : String,
  priceNative: String,
  priceUsd: String,
  volume:[{
      h24:String,
      h6: String,
      h1:String,
      m5:String,
  }]
}


const DataModel = mongoose.model('models', mySchema);
//PUT
app.put("/update/:id", async(req,res)=>{
  let newid = req.params.id;
  let olddata = await DataModel.findById(newid);
  olddata = await DataModel.findByIdAndUpdate(newid,req.body,{new:true,
    useFindandModify: true,
    runValidators: true
  })
  if(olddata==null)return res.status(500).send("No such data exists");
  res.status(200).json({
    olddata
  })
})


//POST
app.post('/post', async(req,res)=>{
   const data = new DataModel({
     id : req.body.id,
     priceNative : req.body.priceNative,
     priceUsd : req.body.priceUsd,
     volume :[{
         h24 : req.body.h24,
         h6 : req.body.h6,
         h1 : req.body.h1,
         m5 : req.body.m5
     }]
   })
  
   const val = await data.save();
   return res.status(200).send("Posted Successfully");
})

//read
app.get('/all',async(req,res)=>{
   const all = await DataModel.find();
   res.status(200).json({
     all
   });
})

//delete
app.delete('/delete/:id',async(req,res)=>{
       let delid = req.params.id;
       let data = await DataModel.findById(delid);
       if(data==null)return res.status(500).send("No such data exists");
       await data.deleteOne();
      return res.status(200).send("Data Deleted Successfully");
})