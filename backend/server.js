const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 8000;
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/MapWorkShop");
    console.log(`MongoDB connected :${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: false })  );
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/maps", require("./routes/mapRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/maps", require("./routes/commentRoutes"));

// Serve frontend for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
}

app.listen(port, () => console.log(`Server started on port ${port}`));
