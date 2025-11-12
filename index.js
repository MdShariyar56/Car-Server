const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require('dotenv').config();



const app = express()
const port =  process.env.PORT || 3000

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enzrljw.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
   
    const db = client.db('car_DB')
    const modelCollection = db.collection('cars')


    app.get('/cars',async (req, res) => {
        const result = await modelCollection.find().toArray()
        res.send(result)
    });

    app.get('/cars/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const car = await modelCollection.findOne({ _id: new ObjectId(id) });
        if (!car) return res.status(404).send({ message: "Car not found" });
        res.send(car);
    } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message });
    }
   });







    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req,res) => {
    res.send("Server is running fine!")
})


app.listen(port,()=> {
    console.log(`Server is Listenting on port ${port}`)
})