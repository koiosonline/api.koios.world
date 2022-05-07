import express from "express";
import helmet from "helmet";
import cors from "cors";
import merkleClaimHandler from "./handlers/merkleClaimHandler.js";
import fetchDiscordLevels from "./services/discord/fetchDiscordLevels.js";
import schedule from "node-schedule";
import dotenv from "dotenv";
import { services } from "./services/index.js";

const PORT = process.env.PORT || 8000;
dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json());

// Callback to get data on the first load
fetchDiscordLevels();

// Scheduler to get new data for every day
schedule.scheduleJob("0 0 * * *", async () => {
  await fetchDiscordLevels();
});

app.use(
  "/api",
  cors({
    origin: [
      "http://localhost:3000",
      "https://app.koios.world",
      "https://koios.world",
      "http://dev-app.koios.world",
    ],
    methods: ["GET", "POST"],
  }),
  services
);

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

app.listen(PORT, () => {
  console.log("server is listening on port " + PORT);
});
