import express from "express";
import helmet from "helmet";
import merkleClaimHandler from "./handlers/merkleClaimHandler.js";
import faucetClaimhandler from "./handlers/faucetClaimHandler.js";
import fetchDiscordLevels from "./services/fetchDiscordLevels.js";
import { scheduleJob } from "node-schedule";
import dotenv from "dotenv";
import handleDiscordLevel from "./handlers/discordLevelHandler.js";
import handleDiscordLevelPerUser from "./handlers/discordLevelPerUserHandler.js";

const PORT = process.env.PORT || 8000;
dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json());

// Callback to get data on the first load
fetchDiscordLevels();

// Scheduler to get new data for every day
const calendarSchedule = scheduleJob("* 1 * * *", async () => {
  await fetchCalendar();
  await fetchDiscordLevels();
});

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
  res.setHeader("Access-Control-Allow-Methods", ["GET", "POST"]);

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

// discordLevel endpoints
app.get("/discordLevels", async (req, res) => {
  res.send(await handleDiscordLevel());
});

app.get("/discordLevels/:username", async (req, res) => {
  res.send(await handleDiscordLevelPerUser(req.params.username));
});

app.get("/", (req, res) => {
  res.send("Welcome to the Koios middleware");
});

app.post("/merkleClaim", async (req, res) => {
  try {
    res.send(await merkleClaimHandler(req.body));
  } catch (e) {
    res.status(400).send("Bad Request");
  }
});

app.post("/claim", async (req, res) => {
  res.send(await faucetClaimhandler(req.body));
});

app.listen(PORT, () => {
  console.log("server is listening on port " + PORT);
});
