const express = require("express");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 2020;

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET",
};

const app = express();
app.use(cors(corsOptions));

app.get("/", cors(corsOptions), (req, res) => {
  res.json({
    test: "test",
  });
});

app.listen(PORT, () => {
  console.log("server is listening on port ");
});
