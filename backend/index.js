const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config()

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.listen(4000);
