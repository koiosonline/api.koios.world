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
const ABI_json_1 = __importDefault(require("./data/ABI.json"));
const web3_1 = __importDefault(require("web3"));
const executeClaim = (claimerAddress, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.CONTRACT_ADDRESS);
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const privateKey = process.env.PRIV_KEY;
    let web3 = new web3_1.default("https://rinkeby.infura.io/v3/8e4de63cfa6842e2811b357d94423d01");
    let contract = new web3.eth.Contract(JSON.parse(ABI_json_1.default.result), CONTRACT_ADDRESS);
    let account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
    let status = { status: 1, message: "Successfully claimed!" };
    if (data.success) {
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;
        console.log("Checking address: " + claimerAddress);
        yield contract.methods
            .claim(claimerAddress)
            .estimateGas({
            from: account.address,
        })
            .then(function (gasAmount) {
            return __awaiter(this, void 0, void 0, function* () {
                const nextNonce = yield web3.eth.getTransactionCount(web3.eth.defaultAccount, "pending");
                contract.methods.claim(claimerAddress).send({
                    from: account.address,
                    gasLimit: gasAmount,
                    nonce: nextNonce,
                });
            });
        })
            .catch((err) => {
            console.log("[Gas Estimation]: " + err);
            status.status = 0;
            status.message = "Address already claimed!";
        });
    }
    else {
        status.status = 3;
        status.message = "Invalid Captcha!";
    }
    return status;
});
exports.default = executeClaim;
//# sourceMappingURL=executeClaim.js.map