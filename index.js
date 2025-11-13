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
   // await client.connect();
   
    const db = client.db('car_DB')
    const modelCollection = db.collection('cars')
    const bookingsCollection = db.collection('bookings');


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

   app.post("/cars", async (req, res) => {
  try {
    const car = {
      ...req.body,
      status: 'Available', 
      createdAt: new Date()
    };
    const result = await modelCollection.insertOne(car);
    res.status(201).send({ message: "Car added", carId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Could not add car", error: err.message });
  }
});

  app.delete("/cars/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const result = await modelCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Car not found" });
      }

      res.send({ message: "Car deleted successfully" });
    } catch (err) {
      res.status(500).send({ message: "Could not delete car", error: err.message });
    }
});


 app.put("/cars/:id", async (req, res) => {
  const id = req.params.id;
  const updatedCar = req.body;

  try {
    const result = await modelCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedCar }
    );

   
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Car not found" });
    }

    res.send({ message: "Car updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Could not update car", error: err.message });
  }
});

  app.post("/bookings", async (req, res) => {
    try {
    const booking = req.body;

    // Validation check
    if (!booking.carId || !booking.userEmail) {
      return res.status(400).send({ message: "carId and userEmail needed" });
    }

    const existing = await bookingsCollection.findOne({
      carId: booking.carId,
      userEmail: booking.userEmail
    });

    if (existing) {
      return res.status(400).send({ message: "You already booked this car!" });
    }
    booking.createdAt = new Date();
    const result = await bookingsCollection.insertOne(booking);

    res.status(201).send({
      success: true,
      message: "Booking successful",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).send({
      success: false,
      message: "Failed to create booking",
      error: err.message,
    });
  }
});

app.get("/bookings", async (req, res) => {
  const { userEmail, carId } = req.query;
  const query = {};
  if (userEmail) query.userEmail = userEmail;
  if (carId) query.carId = carId;

  try {
    const bookings = await bookingsCollection.find(query).toArray();
    res.send(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch bookings", error: err.message });
  }
});

 app.delete("/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Cancelling booking:", id); 

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return res.status(400).send({ success: false, message: "Invalid booking ID" });
    }

    const result = await bookingsCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }

    res.send({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete Booking Error:", err);
    res.status(500).send({ success: false, message: "Could not delete booking", error: err.message });
  }
});










    //await client.db("admin").command({ ping: 1 });
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