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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const GenerationService_1 = require("../services/GenerationService");
const generate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((0, GenerationService_1.checkPassword)(req.body.password)) {
            const resp = yield (0, GenerationService_1.generateJson)();
            if (resp.success) {
                res.status(200).send(resp);
                return;
            }
            res.status(400).send("Bad Request");
            return;
        }
        res.status(404).send("Not Authorized");
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Bad Request");
    }
});
exports.generate = generate;
//# sourceMappingURL=GenerationController.js.map