const express = require("express");
const port = 8800;
const app = express();
const dbConnect = require("./src/config/dbconnect");
const morgan = require('morgan');
const cors = require('cors');

//DB Connection
dbConnect();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use("/", require("./src/routes/index.routes"));


app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`);
});
