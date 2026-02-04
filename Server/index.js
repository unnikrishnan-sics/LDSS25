const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT
const db = require("./dbConnection");
const router = require("./router");
const cors = require("cors")

// In your Express backend
app.use(cors({
  origin: process.env.CLIENT_URL, // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use("/ldss", router);
app.use('/uploads', express.static('uploads'));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

