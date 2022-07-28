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
exports.connectMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.disconnect();
    if (mongoose_1.default.connection.readyState === 1) {
        mongoose_1.default.connections[0];
        return;
    }
    else {
        if (process.env.NODE_ENV === "test") {
            mongoose_1.default.connect(process.env.MONGO_URI_TEST);
        }
        else {
            mongoose_1.default.connect(process.env.MONGO_URI_DEV);
        }
    }
});
exports.connectMongo = connectMongo;
//# sourceMappingURL=connectMongo.js.map