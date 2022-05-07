"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const merkleClaimHandler_js_1 = __importDefault(require("./handlers/merkleClaimHandler.js"));
const DiscordService_1 = require("./api/services/DiscordService");
const node_schedule_1 = __importDefault(require("node-schedule"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = require("./api/index.js");
const PORT = process.env.PORT || 8000;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Callback to get data on the first load.
(0, DiscordService_1.fetchDiscordLevels)();
// Scheduler to get new data for every day
node_schedule_1.default.scheduleJob("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, DiscordService_1.fetchDiscordLevels)();
}));
app.use("/api", (0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://app.koios.world",
        "https://koios.world",
        "http://dev-app.koios.world",
    ],
    methods: ["GET", "POST"],
}), index_js_1.services);
app.get("/", (req, res) => {
    res.send("Welcome to the Koios middleware");
});
app.post("/merkleClaim", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send(yield (0, merkleClaimHandler_js_1.default)(req.body));
    }
    catch (e) {
        res.status(400).send("Bad Request");
    }
}));
app.listen(PORT, () => {
    console.log("server is listening on port " + PORT);
});
//# sourceMappingURL=index.js.map