const express = require("express");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const cors = require("cors");
// q
// native promises
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");

var expressValidator = require("express-validator");

mongoose.connect(
  "mongodb+srv://HassanFouad:Iy26yCujwVWFMufS@cluster0.j0gp6.mongodb.net/social?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);
mongoose.promise = require("bluebird");
mongoose.promise = global.Promise;

const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/user");
//api docs
app.get("/api", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", postRoutes);
app.use("/api", authRoutes);
app.use("/api", usersRoutes);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "You need to log in first" });
  }
});
let path = require("path")
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

const PORT = process.env.PORT || 80;
app.listen(PORT, (req, res) => {
  console.log("server started successfully");
});
