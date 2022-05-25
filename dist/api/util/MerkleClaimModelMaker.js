"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeObjectArray = void 0;
const makeObjectArray = (addressList) => {
    let newMerkleClaimArray = [];
    for (let item of addressList.claims) {
        const newItem = {
            tokenId: item.tokenId,
            claimAddress: item.claimAddress,
        };
        newMerkleClaimArray.push(newItem);
    }
    return newMerkleClaimArray;
};
exports.makeObjectArray = makeObjectArray;
//# sourceMappingURL=MerkleClaimModelMaker.js.map