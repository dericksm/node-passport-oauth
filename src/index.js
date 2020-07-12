require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Routes
const userRoutes = require("./routes/user");

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB")
);

//Initialize express
const app = express();
app.use(cors());

//Middlewares
app.use(express.json());

// Import routes
app.use("/users", userRoutes);

const port = process.env.PORT || 3333;
app.listen(3333, () => console.log(`Server listening at port ${port}`));