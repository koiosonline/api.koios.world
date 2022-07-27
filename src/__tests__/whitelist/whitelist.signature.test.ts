import supertest from "supertest";
import { app } from "../../index";
import * as WhitelistService from "../../api/services/whiteListService";
import * as WhitelistRepo from "../../api/repositories/WhitelistRepo";
import * as WhitelistController from "../../api/controllers/WhitelistController";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IERC721ClaimModel from "../../api/interfaces/Schemas/IERC721ClaimModel";

const expectedSignatureObject: IResponseMessage = {
  success: true,
  message: "Address is whitelisted",
  data: [],
};

const expectedNotWhitelisted: IResponseMessage = {
  success: false,
  error: true,
  message: "Address not whitelisted",
  data: [],
};

const whitelistedAccModel: IERC721ClaimModel = {
  address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
  type: 0,
  dateAchieved: 1234,
};

describe("whitelist", () => {
  describe("[---get signature for address route---]", () => {
    describe("given address is whitelisted", () => {
      it("should return the whitelisted account", async () => {
        const whitelistServiceMock = jest
          .spyOn(WhitelistService, "getSignatureForAddress")
          // @ts-ignore
          .mockReturnValue(expectedSignatureObject);

        const address = "whitelisteAccAddress";

        const { statusCode, body } = await supertest(app).get(
          `/api/whitelist/signature/${address}`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedSignatureObject);
        expect(whitelistServiceMock).toBeCalledTimes(1);
      });
    });

    describe("given address is not whitelisted", () => {
      it("should return the whitelisted account", async () => {
        const whitelistServiceMock = jest
          .spyOn(WhitelistService, "getSignatureForAddress")
          // @ts-ignore
          .mockReturnValue(expectedNotWhitelisted);

        const address = "notWhitelisteAccAddress";

        const { statusCode, body } = await supertest(app).get(
          `/api/whitelist/signature/${address}`
        );

        expect(statusCode).toBe(500);
        expect(body).toEqual(expectedNotWhitelisted);
        expect(whitelistServiceMock).toBeCalledTimes(1);
      });
    });
  });
});

describe("whitelist.getSignatureForAddress", () => {
  describe("given address is in whitelist", () => {
    it("should create a valid signature and return it", async () => {
      const whitelistRepoMock = jest
        .spyOn(WhitelistRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(whitelistedAccModel);

      const returnMessage: IResponseMessage =
        await WhitelistService.getSignatureForAddress(
          "0x981633bc9a25f1411e869e9E8729EedF68Db397f"
        );

      console.log(returnMessage);

      expect(returnMessage.success).toEqual(true);
      expect(returnMessage.message).toEqual("Address is whitelisted");
      expect(returnMessage.data).not.toBeNull();
      expect(whitelistRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given address is not in whitelist", () => {
    it("should create a valid signature and return it", async () => {
      const whitelistRepoMock = jest
        .spyOn(WhitelistRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(null);

      const returnMessage: IResponseMessage =
        await WhitelistService.getSignatureForAddress(
          "0x981633bc9a25f1411e869e9E8729EedF68Db397f"
        );

      expect(returnMessage.success).toEqual(false);
      expect(returnMessage.message).toEqual("Address not whitelisted");
      expect(returnMessage.data).toBeNull();
      expect(whitelistRepoMock).toBeCalledTimes(1);
    });
  });
});
