const express=require('express');
const app=express();


//cors for remote get and post request handling start
const cors = require('cors');
app.use(cors());
//cors for remote get and post request handling ends


//Mongo DB code for DB connect Start
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const assert = require('assert');
//Mongo DB code for DB connect ends



//env config
require('dotenv').config();
//env config ends



// Mongo Connection URL
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcglm.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;




//body parse for getting body json data through API start
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//body parse for getting body json data through API ends







app.get('/',(req,res)=>{
    res.send('Hello dear I am amajhon');
})

app.get('/chittagong',(req,res)=>{
    const info={
        city:'ctg',
        location:'southern'
    }
    res.send(info);
})



// Mongo Use connect method to connect to the Server
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("orders");
  console.log('Database connected');

    //Inserting Data from Inventory, many data at atime
    app.post('/addProduct',(req,res)=>{
        const products=req.body;
        console.log(products);
        productCollection.insertMany(products)
        .then(result=>{
            console.log('product added');
            res.sendStatus(200).send(result.insertedCount);
        })
    })


    app.get('/products',(req,res)=>{
        productCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })


    app.get('/product/:key',(req,res)=>{
        const receivedKey=req.params.key;
        productCollection.find({key:receivedKey})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })


    app.post('/productsByKeys',(req,res)=>{
        const productKeys=req.body;
        productCollection.find({key:{$in:productKeys}})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })


    //Inserting Data from Inventory, many data at atime
    app.post('/addOrder',(req,res)=>{
        const order=req.body;
        console.log(order);
        orderCollection.insertOne(order)
        .then(result=>{
            console.log('order added',result.insertedCount>0);
            res.send(result.insertedCount>0);
        })
        .catch(error=>{
            console.log(error);
        })
    })
  //client.close();
});





//last line of the code
app.listen(5000);
