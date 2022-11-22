const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')


const app = express()

const port = process.env.PORT || 8000
const cors = require('cors')
require('dotenv').config()

// middleware 
app.use(cors())
app.use(express.json())


// Database connection 


const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.vmx3iz0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//  database collections 

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

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})





