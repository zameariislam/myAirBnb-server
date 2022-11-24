const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')


const app = express()
let jwt = require('jsonwebtoken');

const port = process.env.PORT || 8000
const cors = require('cors');
const e = require('express');
const { query } = require('express');
require('dotenv').config()

// middleware 
app.use(cors())
app.use(express.json())


// Database connection 


const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.vmx3iz0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//  database collections 


const userCollection = client.db('airbnbdb').collection('users')
const bookingCollection = client.db('airbnbdb').collection('bookings')
const homeCollection = client.db('airbnbdb').collection('homes')

const dbConnect = async () => {

    try {
        await client.connect()

        console.log('database connected')

    }
    catch (error) {
        console.log(error)

    }


}
dbConnect()


// save useremail and generate JWT 


app.put('/user/:email', async (req, res) => {
    const email = req.params.email
    const user = req.body
    const filter = { email: email }
    const options = { upsert: true };
    const updateDoc = {
        $set:
            user

    };



    const result = await userCollection.updateOne(filter, updateDoc, options);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: 60 * 60 })

    res.send({ result, token })





})

// Save a booking 

app.post('/bookings', async (req, res) => {

    const bookingData = req.body
    const result = await bookingCollection.insertOne(bookingData);
    console.log(result)
    res.send(result)


})

// get All bookings 


app.get('/bookings', async (req, res) => {

    const email = req.query.email
    let query = {}
    if (email) {
        query = { guestEmail: email }
    }
    const bookings = await bookingCollection.find(query).toArray();
    console.log(bookings)
    res.send(bookings)


})
//  get a single user by email 


app.get('/user/:email', async (req, res) => {

    const email = req.params.email


    const query = { email: email }

    const user = await userCollection.findOne(query);
    console.log(user)
    res.send(user)


})


//  get all users 

app.get('/users', async (req, res) => {

    

    const users = await userCollection.find().toArray();
    console.log(users)
    res.send(users)


})


// add a home 


app.post('/homes', async (req, res) => {

    const homeData = req.body
    const result = await homeCollection.insertOne(homeData);
    console.log(result)
    res.send(result)


})





app.get('/', (req, res) => {
    res.send('Server is running')
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})





