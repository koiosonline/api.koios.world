import supertest from "supertest";
import { app } from "../../index";
import * as DynamicNFTService from "../../api/services/DynamicNFTService";
import * as DynamicNFTRepo from "../../api/repositories/DynamicNFTRepo";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IERC721ClaimModel from "../../api/interfaces/Schemas/IERC721ClaimModel";

const expectedSignatureObject: IResponseMessage = {
  success: true,
  message: "Address is DynamicNFT Whitelisted",
  data: [],
};

const expectedNotDynamicNFTWhitelisted: IResponseMessage = {
  success: false,
  error: true,
  message: "Address not DynamicNFT Whitelisted",
  data: [],
};

const DynamicNFTWhitelistedAccModel: IERC721ClaimModel = {
  address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
  type: 0,
  dateAchieved: 1234,
};

describe("dynamicNFT", () => {
  describe("[---get signature for address route---]", () => {
    describe("given address is DynamicNFT Whitelisted", () => {
      it("should return the DynamicNFT Whitelisted account", async () => {
        const DynamicNFTServiceMock = jest
          .spyOn(DynamicNFTService, "getSignatureForAddress")
          // @ts-ignore
          .mockReturnValue(expectedSignatureObject);

        const address = "DynamicNFTeAccAddress";

        const { statusCode, body } = await supertest(app).get(
          `/api/DynamicNFT/signature/${address}`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedSignatureObject);
        expect(DynamicNFTServiceMock).toBeCalledTimes(1);
      });
    });

    describe("given address is not DynamicNFT Whitelisted", () => {
      it("should return the DynamicNFT Whitelisted account", async () => {
        const DynamicNFTServiceMock = jest
          .spyOn(DynamicNFTService, "getSignatureForAddress")
          // @ts-ignore
          .mockReturnValue(expectedNotDynamicNFTWhitelisted);

        const address = "notDynamicNFTeAccAddress";

        const { statusCode, body } = await supertest(app).get(
          `/api/DynamicNFT/signature/${address}`
        );

        expect(statusCode).toBe(500);
        expect(body).toEqual(expectedNotDynamicNFTWhitelisted);
        expect(DynamicNFTServiceMock).toBeCalledTimes(1);
      });
    });
  });
});

describe("dynamicNFT.getSignatureForAddress", () => {
  describe("given address is in DynamicNFT", () => {
    it("should create a valid signature and return it", async () => {
      const DynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValueOnce(DynamicNFTWhitelistedAccModel);

      const returnMessage: IResponseMessage =
        await DynamicNFTService.getSignatureForAddress(
          "0x981633bc9a25f1411e869e9E8729EedF68Db397f"
        );

      expect(returnMessage.success).toEqual(true);
      expect(returnMessage.message).toEqual("Address is whitelisted");
      expect(returnMessage.data).not.toBeNull();
      expect(DynamicNFTRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given address is not in DynamicNFT", () => {
    it("should not create a signature and return with error", async () => {
      const DynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(null);

      const returnMessage: IResponseMessage =
        await DynamicNFTService.getSignatureForAddress(
          "0x981633bc9a25f1411e869e9E8729EedF68Db397f"
        );

      expect(returnMessage.success).toEqual(false);
      expect(returnMessage.message).toEqual("Address not whitelisted");
      expect(returnMessage.data).toBeNull();
      expect(DynamicNFTRepoMock).toBeCalledTimes(1);
    });
  });
});
