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
exports.getAll = exports.create = exports.signature = exports.get = void 0;
const ClaimsRepo_1 = require("../repositories/ClaimsRepo");
const MintService_1 = require("../services/MintService");
//TODO remove this
{
    /*
  export const post = async (req: Request, res: Response) => {
    try {
      const merkleClaim: IClaimModel = req.body;
      if (merkleClaim.claimAddress && merkleClaim.tokenId) {
        const proof = await getProof(
          merkleClaim.claimAddress,
          merkleClaim.tokenId
        );
        if (proof.success) {
          res.send(proof);
          return;
        }
      }
      res.status(400).send("Bad Request");
      return;
    } catch (err) {
      console.log(err);
      res.status(400).send("Bad Request");
    }
  };
  export const rootHash = async (req: Request, res: Response) => {
    try {
      const root = await getHexProofForList();
      if (root.success) {
        res.send(root);
        return;
      }
      res.status(500).send("Internal Server Error");
      return;
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  };
  */
}
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const claimAddress = req.params.claimAddress;
        if (claimAddress) {
            const tokens = yield (0, MintService_1.getTokensForAccount)(claimAddress);
            if (tokens.success) {
                res.send(tokens);
                return;
            }
        }
        res.status(404).send("Bad Request");
        return;
    }
    catch (err) {
        console.log(err);
        res.status(404).send("Bad Request");
    }
});
exports.get = get;
const signature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merkleClaim = req.body;
        if (merkleClaim.claimAddress && merkleClaim.tokenId) {
            const proof = yield (0, MintService_1.getSignature)(merkleClaim.claimAddress, merkleClaim.tokenId);
            if (proof.success) {
                res.send(proof);
                return;
            }
            if (proof.invalid) {
                res.status(400).send("Not Whitelisted!");
                return;
            }
        }
        res.status(400).send("Bad Request");
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Bad Request");
    }
});
exports.signature = signature;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (data.claimAddress && data.tokenId && data.whitelist !== undefined) {
            const token = yield (0, ClaimsRepo_1.createTokenForAccount)(data);
            if (token) {
                res.status(200).send(token);
                return;
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Bad Request");
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, ClaimsRepo_1.getAllWhitelistedAccounts)();
        if (token) {
            res.status(200).send(token);
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Bad Request");
    }
});
exports.getAll = getAll;
//# sourceMappingURL=MintController.js.map