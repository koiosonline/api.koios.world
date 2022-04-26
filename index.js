import express from "express";
import helmet from "helmet";
import axios from "axios";
import merkleClaimHandler from "./handlers/merkleClaimHandler.js";
import faucetClaimhandler from "./handlers/faucetClaimHandler.js";
import dotenv from "dotenv";

const PORT = process.env.PORT || 8000;
dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  // Website you wish to allow to connect. for now only koios.world and app.koios.world
  const allowedOrigins = [
    "http://localhost:3000",
    "https://app.koios.world",
    "https://koios.world",
    "http://dev-app.koios.world",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.listen(PORT, () => {
  console.log("server is listening on port " + PORT);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Koios middleware");
});

app.post("/merkleClaim", async function (req, res) {
  res.send(await merkleClaimHandler(req.body));
});

app.post("/claim", async function (req, res) {
  res.send(await faucetClaimhandler(req.body));
});
