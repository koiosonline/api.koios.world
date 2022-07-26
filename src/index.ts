import express from "express";
import helmet from "helmet";
import cors from "cors";
import { fetchDiscordLevels } from "./api/services/DiscordService";
import { generateJson } from "./api/services/GenerationService";
import schedule from "node-schedule";
import dotenv from "dotenv";
import { services } from "./api/index";
import cron from "node-cron";
import { connectMongo } from "./api/db/connectMongo";
import { watchDynamicNFT } from "./api/services/DynamicNFTService";

const PORT = process.env.PORT || 8000;
dotenv.config();
export const app = express();
app.use(helmet());
app.use(express.json());

// Callback to get data on the first load.
fetchDiscordLevels();

// Connect to database on the first load.
connectMongo();

// Scheduler to get new data for every day
schedule.scheduleJob("0 0 * * *", async () => {
  await fetchDiscordLevels();
});

cron.schedule(
  "*/30 * * * * *",
  async () => {
    await generateJson();
    await watchDynamicNFT();
  },
  {}
);

app.use(
  "/api",
  cors({
    origin: [
      "http://localhost:3000",
      "https://app.koios.world",
      "https://koios.world",
      "http://dev-app.koios.world",
      "https://titans.koios.world",
    ],
    methods: ["GET", "POST"],
  }),
  services
);

app.get("/", (req, res) => {
  res.send("Welcome to the Koios middleware");
});

app.listen(PORT, () => {
  console.log("server is listening on port " + PORT);
});
