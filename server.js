const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mySQLPool = require("./config/db");
const cors = require("cors");
const { corsOptions } = require("./utils/corsOptions");

//! Student Routes Module
const studentRoutes = require("./routes/students/studentRoutes");
const userRoutes = require("./routes/users/userRoutes");

//! Configure dotenv
dotenv.config();
const PORT = process.env.PORT || 5000;

//! Rest object
const app = express();

//! Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

//! Routes
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/test", (req, res) => {
  res.status(200).send("<h1>Welcome from server</h1>");
});

//! Conditional Listen
mySQLPool
  .query("SELECT 1")
  .then(() => {
    //! MySQL
    console.log("MySQL DB Connected".bgCyan.white);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`.bgMagenta.white);
    });
  })
  .catch((error) => {
    console.log(error);
  });
