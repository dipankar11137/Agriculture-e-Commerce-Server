const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


const uri =
  'mongodb+srv://agriculture_e_commerce:nkTxK9tTPSkdZ8xL@cluster0.3hcpsfc.mongodb.net/?retryWrites=true&w=majority';


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    // console.log("database connect");
    const userCollection = client
      .db('agriculture-e-commerce')
      .collection('user');
    const buyAndSellsCollection = client
      .db('agriculture-e-commerce')
      .collection('buyAndSells');
    const buyCollection = client.db('agriculture-e-commerce').collection('buy');

    // //   // // // // // // // // // // // //

    // // create and update User
    //create and update a user
    app.put('/create-user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const filter = { email: email };
      const options = { upsert: true };

      const updatedDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // get user
    app.get('/user', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // // all User filter by email category
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // Buy and sells
    // post Buy and sells
    app.post('/buyAndSells', async (req, res) => {
      const postResult = req.body;
      const result = await buyAndSellsCollection.insertOne(postResult);
      res.send(result);
    });
    // Get Buy and sells
    app.get('/buyAndSells', async (req, res) => {
      const query = {};
      const cursor = buyAndSellsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get blood by id
    app.get('/buyAndSells/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await buyAndSellsCollection.findOne(query);
      res.send(result);
    });
    // // get buy filter by category
    app.get('/buyAndSell/:category', async (req, res) => {
      const category = req.params.category;
      const query = { category };
      const cursor = buyAndSellsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // restock Product item and update
    app.put('/buyAndSellsUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await buyAndSellsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // // Delete one item
    app.delete('/buyAndSells/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await buyAndSellsCollection.deleteOne(query);
      res.send(result);
    });

    //                         buy items
    // post buy
    app.post('/buy', async (req, res) => {
      const postResult = req.body;
      const result = await buyCollection.insertOne(postResult);
      res.send(result);
    });

    // Get Buy
    app.get('/buy', async (req, res) => {
      const query = {};
      const cursor = buyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get blood by id
    app.get('/buy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await buyCollection.findOne(query);
      res.send(result);
    });
    // get buy filter by email
    app.get('/buys/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = buyCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });
    // restock buy blood item and update payment
    app.put('/buyPayment/:id', async (req, res) => {
      const id = req.params.id;
      const updatePayment = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          payment: updatePayment.payment,
        },
      };
      const result = await buyCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });
    // restock buy blood item and update delivered
    app.put('/buyDelivered/:id', async (req, res) => {
      const id = req.params.id;
      const updateDelivered = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          delivered: updateDelivered.delivered,
        },
      };
      const result = await buyCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });
    // // Delete one buy
    app.delete('/buy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await buyCollection.deleteOne(query);
      res.send(result);
    });

    // // get buy filter by email
    // app.get('/buyBlood/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const cursor = buyBloodsCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });

    // // restock blood item and update
    // app.put('/userId/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updateFreeBlood = req.body;
    //   const query = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       freeBlood: updateFreeBlood.freeBlood,
    //     },
    //   };
    //   const result = await userCollection.updateOne(query, updateDoc, options);
    //   res.send(result);
    // });
    // // get blood
    // app.get('/bloods', async (req, res) => {
    //   const query = {};
    //   const cursor = bloodsCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // // get blood by id
    // app.get('/blood/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await bloodsCollection.findOne(query);
    //   res.send(result);
    // });

    // // restock blood item and update
    // app.put('/bloodId/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updateQuantity = req.body;
    //   const query = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       quantity: updateQuantity.quantity,
    //     },
    //   };
    //   const result = await bloodsCollection.updateOne(
    //     query,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // });

    // //                     Buy    //
    // // post buy
    // app.post('/buyBlood', async (req, res) => {
    //   const postResult = req.body;
    //   const result = await buyBloodsCollection.insertOne(postResult);
    //   res.send(result);
    // });

    // // Get all Buy
    // app.get('/buyBlood', async (req, res) => {
    //   const query = {};
    //   const cursor = buyBloodsCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // // get buy blood by id
    // app.get('/buyBloodBuyId/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await buyBloodsCollection.findOne(query);
    //   res.send(result);
    // });
    // // get buy filter by email
    // app.get('/buyBlood/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const cursor = buyBloodsCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });

    // // restock buy blood item and update delivered
    // app.put('/buyBloodId/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updateDelivered = req.body;
    //   const query = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       delivered: updateDelivered.delivered,
    //     },
    //   };
    //   const result = await buyBloodsCollection.updateOne(
    //     query,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // });
    // // restock buy blood item and update payment
    // app.put('/buyBloodPayment/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updatePayment = req.body;
    //   const query = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       payment: updatePayment.payment,
    //     },
    //   };
    //   const result = await buyBloodsCollection.updateOne(
    //     query,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // });
    // // // Delete one buy blood
    // app.delete('/buyBlood/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await buyBloodsCollection.deleteOne(query);
    //   res.send(result);
    // });
    // //donate blood update and put data
    // app.put('/donateBlood/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const user = req.body;

    //   const filter = { email: email };
    //   const options = { upsert: true };

    //   const updatedDoc = {
    //     $set: user,
    //   };

    //   const result = await donateBloodCollection.updateOne(
    //     filter,
    //     updatedDoc,
    //     options
    //   );
    //   res.send(result);
    // });
    // // Get all donate blood
    // app.get('/donateBlood', async (req, res) => {
    //   const query = {};
    //   const cursor = donateBloodCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // // restock donate blood and update accept
    // app.put('/donateBloodId/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updateAccept = req.body;
    //   const query = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       accept: updateAccept.accept,
    //     },
    //   };
    //   const result = await donateBloodCollection.updateOne(
    //     query,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // });
    // // // Delete one donate blood
    // app.delete('/donateBlood/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await donateBloodCollection.deleteOne(query);
    //   res.send(result);
    // });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Agriculture e Commerce');
});

app.listen(port, () => {
  console.log('Agriculture e Commerce is running ');
});
