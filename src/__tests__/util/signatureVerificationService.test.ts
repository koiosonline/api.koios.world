import { utils } from "ethers";
import * as SignatureVerificationService from "../../api/services/util/SignatureVerificationService";
import * as WhitelistRepo from "../../../src/api/repositories/WhitelistRepo";
import * as CouponRepo from "../../../src/api/repositories/CouponRepo";
import * as Alchemy from "@alch/alchemy-sdk";

const getNftsResponse = {
  ownedNfts: [
    {
      tokenId: 1,
    },
    {
      tokenId: 2,
    },
    {
      tokenId: 3,
    },
  ],
};

const getNftsResponseDynamic = {
  ownedNfts: [
    {
      tokenId: 1,
    },
  ],
};

describe("signatureVerificationService", () => {
  describe("[---verifyMessage---]", () => {
    describe("given account is whitelisted and address succesfully recovered", () => {
      it("should return true", async () => {
        const ethersMock = jest
          .spyOn(utils, "verifyMessage")
          .mockReturnValue("0x123");

        const whitelistRepoMock = jest
          .spyOn(WhitelistRepo, "findWhitelistedAccount")
          //@ts-ignore
          .mockReturnValue(true);

        const actualResponse = await SignatureVerificationService.verifyMessage(
          "0x123",
          "lol"
        );

        expect(actualResponse).toEqual(true);
        expect(whitelistRepoMock).toBeCalledTimes(1);
        expect(ethersMock).toBeCalledTimes(1);
      });
    });

    describe("given account is not whitelisted and address succesfully recovered", () => {
      it("should return false", async () => {
        const ethersMock = jest
          .spyOn(utils, "verifyMessage")
          .mockReturnValue("0x123");

        const whitelistRepoMock = jest
          .spyOn(WhitelistRepo, "findWhitelistedAccount")
          //@ts-ignore
          .mockReturnValue(null);

        const actualResponse = await SignatureVerificationService.verifyMessage(
          "0x123",
          "lol"
        );

        expect(actualResponse).toEqual(false);
        expect(whitelistRepoMock).toBeCalledTimes(1);
        expect(ethersMock).toBeCalledTimes(1);
      });
    });
  });

  describe("[---verifyMessageForLayer---]", () => {
    describe("given a coupon exists", () => {
      it("should return the coupon", async () => {
        const ethersMock = jest
          .spyOn(utils, "verifyMessage")
          .mockReturnValue("0x123");

        const couponRepoMock = jest
          .spyOn(CouponRepo, "findExistingCoupon")
          //@ts-ignore
          .mockReturnValue("0x123");

        const actualResponse =
          await SignatureVerificationService.verifyMessageForLayer(
            "0x123",
            "lol"
          );

        expect(actualResponse).toEqual("0x123");
        expect(couponRepoMock).toBeCalledTimes(1);
        expect(ethersMock).toBeCalledTimes(1);
      });
    });
  });

  describe("[---verifyMessageForOwnedLayers---]", () => {
    describe("given user owns all layers", () => {
      it("should return true", async () => {
        const ethersMock = jest
          .spyOn(utils, "verifyMessage")
          .mockReturnValue("0x123");

        const nftsOwner = jest
          .spyOn(Alchemy, "getNftsForOwner")
          //@ts-ignore
          .mockReturnValue(getNftsResponse);

        const actualResponse =
          await SignatureVerificationService.verifyMessageForOwnedLayers(
            "test",
            "0x123",
            [0, 1, 2, 3, 0]
          );

        expect(actualResponse).toEqual(true);
        expect(nftsOwner).toBeCalledTimes(1);
        expect(ethersMock).toBeCalledTimes(1);
      });
    });

    describe("given user does not own all layers", () => {
      it("should return false", async () => {
        const ethersMock = jest
          .spyOn(utils, "verifyMessage")
          .mockReturnValue("0x123");

        const nftsOwner = jest
          .spyOn(Alchemy, "getNftsForOwner")
          //@ts-ignore
          .mockReturnValue(getNftsResponse);

        const actualResponse =
          await SignatureVerificationService.verifyMessageForOwnedLayers(
            "test",
            "0x123",
            [0, 1, 2, 3, 0, 5]
          );

        expect(actualResponse).toEqual(false);
        expect(nftsOwner).toBeCalledTimes(1);
        expect(ethersMock).toBeCalledTimes(1);
      });
    });
  });

  describe("[---verifyDynamicNFTOwnership---]", () => {
    describe("given user owns the dyanmicNFT", () => {
      it("should return true", async () => {
        const ethersMock = jest
          .spyOn(utils, "verifyMessage")
          .mockReturnValue("0x123");

        const nftsOwner = jest
          .spyOn(Alchemy, "getNftsForOwner")
          //@ts-ignore
          .mockReturnValue(getNftsResponseDynamic);

        const actualResponse =
          await SignatureVerificationService.verifyDynamicNFTOwnership(
            "test",
            "0x123",
            1
          );

        expect(actualResponse).toEqual(true);
        expect(nftsOwner).toBeCalledTimes(1);
        expect(ethersMock).toBeCalledTimes(1);
      });
    });

    describe("given user does not own the dyanmicNFT", () => {
      it("should return false", async () => {
        const ethersMock = jest
          .spyOn(utils, "verifyMessage")
          .mockReturnValue("0x123");

        const nftsOwner = jest
          .spyOn(Alchemy, "getNftsForOwner")
          //@ts-ignore
          .mockReturnValue(getNftsResponseDynamic);

        const actualResponse =
          await SignatureVerificationService.verifyDynamicNFTOwnership(
            "test",
            "0x123",
            3
          );

        expect(actualResponse).toEqual(false);
        expect(nftsOwner).toBeCalledTimes(1);
        expect(ethersMock).toBeCalledTimes(1);
      });
    });
  });
});
