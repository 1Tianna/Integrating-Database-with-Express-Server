const mongoose = require("mongoose");
const express = require("express");
const bcrypst = require("bcrypt");
const app = express();
const PORT = 3000;
app.use(express.json());
//create a new mongoose model
const userSchema = new mongoose.Schema({
  username: {
    type: String, //datatype
    required: true, // optional
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true
  }, 
  email: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;

// get a user
app.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let foundUser = await User.findById(id);
    if (!foundUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(foundUser);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// create a user
app.post("/users", async (req, res) => {
  try {
      const { username, password } = req.body;
    let hashedPassword = bcrypt.hash(password, 10)
    const newUser = new User({ username, hashedPassword });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.log("error" + error);
    res.status(400).send(error); //
  }
});
// POST route
app.post('/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  // GET route
  app.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  });
const uri = "mongodb+srv://1Tianna:securepassword123@tianna.fjrlcek.mongodb.net/?retryWrites=true&w=majority&appName=Tianna"
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function connectDb() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(error) {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
    console.log("error: " + error)
  }
}

app.listen(PORT, async () => {
    await connectDb().catch(console.dir);
    console.log(`Express API at: localhost:${PORT}`)
})