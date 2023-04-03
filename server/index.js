const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Counter= require('./model/CounterSchema');
const app = express();
dotenv.config();
var id = 0;
// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/m2", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {console.log('Connected to MongoDB')
  const newCounter = new Counter({ counter: 0 })
  newCounter.save().then(res=>
    
    {id=res._id.toString();
      console.log(res)
    console.log(id)});
}
  
  )
  .catch(error => console.error(error));

// Enable CORS
app.use(cors());

// Add middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes

app.get('/',  async (req, res) => {
 
  const data = await Counter.findOne({_id:id});
  
  res.status(200).json({ counter: data.counter  });
});
app.get('/count',  async (req, res) => {
  const data = await Counter.findOneAndUpdate({_id:id},{ $inc: { counter: 1 } }, { returnDocument: "after" });
  res.status(200).json({ counter: data.counter  });
});
// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
