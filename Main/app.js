require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

//connectDB
const connectDB = require("./db/connect");

//middleware
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routers
const adminRouter = require("./routes/adminRouter")
const studentRouter = require("./routes/studentRouter")

//routes 
app.use("/api/v1/user",studentRouter);
app.use("/api/v1/admin",adminRouter)

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

//connecting to database
start();
