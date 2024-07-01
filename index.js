const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ADD THIS LINE
const app = express();
const PORT = 3000;
app.use(cors()); // ADD THIS LINE
// Replace with your MongoDB URI
const MONGODB_URI =
  "mongodb+srv://vijaya:vijaya@cluster0.zpnoeke.mongodb.net/vijaya?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const flipkartSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    product_name: String,
    product_category_tree: String,
    retail_price: Number,
    discounted_price: Number,
    image: [String],
    description: String,
    product_rating: String,
    brand: String,
    product_specifications: mongoose.Schema.Types.Mixed,
  },
  { collection: "flipcart" }
);

const Flipkart = mongoose.model("flipcart", flipkartSchema);

// Route to get data in chunks of 20
app.get("/data", cors(), async (req, res) => { // ADD THIS LINE
  const page = parseInt(req.query.page) || 1;
  const limit = 2000;
  const skip = (page - 1) * limit;

  try {
    const data = await Flipkart.find().skip(skip).limit(limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.timeout = 300000; // 300000 milliseconds = 5 minutes
