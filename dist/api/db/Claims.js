"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const claimModelSchema = new mongoose_1.Schema({
    tokenId: { type: Number, required: true },
    claimAddress: { type: String, required: true },
    whitelist: { type: Boolean, required: true },
});
const Claims = mongoose_1.models.Claims || (0, mongoose_1.model)("claims", claimModelSchema);
exports.default = Claims;
//# sourceMappingURL=Claims.js.map