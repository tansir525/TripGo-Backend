const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x0hdu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// id: tripGo;
// Pass: TDi6l2j2YTRyvApr;

async function run() {
  try {
    await client.connect();
    const database = client.db("tripGo");
    const servicesCollection = database.collection("services");
    const productsCollection = database.collection("products");

    // Get Api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //Get Products Api
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // Post Api

    app.post("/services", async (req, res) => {
      const service = req.body;

      console.log("hit the post Api", service);
      //   const service = {
      //     name: "orick",
      //     price: "500",
      //     description: "lorem ipsum lorem ipsum lorem ipsum",
      //   };
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.send(result);
    });

    //Delete services Api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      console.log("deleting user id", result);
      res.json(result);
    });
  } finally {
    //await clint.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running");
});
app.listen(port, () => {
  console.log("Running or not", port);
});
