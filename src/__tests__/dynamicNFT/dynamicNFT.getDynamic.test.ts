import supertest from "supertest";
import { app } from "../../index";
import * as DynamicNFTService from "../../api/services/DynamicNFTService";
import * as DynamicNFTRepo from "../../api/repositories/DynamicNFTRepo";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IERC721ClaimModel from "../../api/interfaces/Schemas/IERC721ClaimModel";

const expectedDyamicWhitelistExists: IResponseMessage = {
  success: true,
  message: "Address is whitelisted",
  data: {
    address: "0x981633bc9a25f1411e869e9E8729EedF68Db397b",
    type: 0,
    dateAchieved: 1234,
  },
};

const expectedDyamicWhitelistNotExists: IResponseMessage = {
  success: false,
  error: true,
  message: "Address is not whitelisted",
  data: [],
};

const dynamicNFTWhitelistedAccModel: IERC721ClaimModel = {
  address: "0x981633bc9a25f1411e869e9E8729EedF68Db397b",
  type: 0,
  dateAchieved: 1234,
};

describe("dynamicNFT", () => {
  describe("[---get whitelisted dynamic address---]", () => {
    describe("given address is whitelisted", () => {
      it("should return the whitelisted account", async () => {
        const DynamicNFTServiceMock = jest
          .spyOn(DynamicNFTService, "findWhitelistedAddress")
          // @ts-ignore
          .mockReturnValue(expectedDyamicWhitelistExists);

        const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397b";

        const { statusCode, body } = await supertest(app).get(
          `/api/dynamicNFT/getWhitelistedAddress/${address}`
        );
        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedDyamicWhitelistExists);
        expect(DynamicNFTServiceMock).toBeCalledTimes(1);
      });
    });

    describe("given address is not whitelisted", () => {
      it("should return success false and error code 500", async () => {
        const DynamicNFTServiceMock = jest
          .spyOn(DynamicNFTService, "findWhitelistedAddress")
          // @ts-ignore
          .mockReturnValue(expectedDyamicWhitelistNotExists);

        const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397b";

        const { statusCode, body } = await supertest(app).get(
          `/api/dynamicNFT/getWhitelistedAddress/${address}`
        );
        expect(statusCode).toBe(500);
        expect(body).toEqual(expectedDyamicWhitelistNotExists);
        expect(DynamicNFTServiceMock).toBeCalledTimes(1);
      });
    });
  });
});

describe("dynamicNFT.findWhitelistedAddress", () => {
  describe("given address is whitelisted", () => {
    it("should return the whitelisted account", async () => {
      const DynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(dynamicNFTWhitelistedAccModel);

      const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397b";
      const returnedData = await DynamicNFTService.findWhitelistedAddress(
        address
      );

      expect(returnedData).toEqual(expectedDyamicWhitelistExists);
      expect(DynamicNFTRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given address is not whitelisted", () => {
    it("should return the with false and empty data array", async () => {
      const DynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(null);

      const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397b";
      const returnedData = await DynamicNFTService.findWhitelistedAddress(
        address
      );

      expect(returnedData.success).toEqual(false);
      expect(returnedData.message).toEqual("Address not whitelisted");
      expect(returnedData.data).toEqual(null);
      expect(DynamicNFTRepoMock).toBeCalledTimes(1);
    });
  });
});
