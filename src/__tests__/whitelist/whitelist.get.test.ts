import supertest from "supertest";
import { app } from "../../index";
import * as WhitelistService from "../../api/services/whiteListService";
import * as WhitelistRepo from "../../api/repositories/WhitelistRepo";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IWhitelistModel from "../../api/interfaces/Schemas/IWhitelistModel";

const expectedWhitelistCheck: IResponseMessage = {
  success: true,
  message: "Account is whitelisted",
  data: {
    address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
    name: "Leslie",
  },
};

const expectedWhitelistCheckFail: IResponseMessage = {
  success: false,
  error: true,
  message: "Account is not whitelisted",
  data: {},
};

const expectedAccModelFound: IWhitelistModel = {
  address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
  name: "Leslie",
};

const expectedResponseDataWhitelisted: IResponseMessage = {
  success: true,
  message: "Address is whitelisted",
  data: {
    address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
    name: "Leslie",
  },
};

const expectedResponseDataNotWhitelisted: IResponseMessage = {
  success: false,
  error: true,
  message: "Address not whitelisted",
  data: null,
};

describe("whitelist", () => {
  describe("[---get whitelisted address---]", () => {
    describe("given address is whitelisted", () => {
      it("should return the whitelisted account", async () => {
        const createWhitelistServiceMock = jest
          .spyOn(WhitelistService, "findAddress")
          // @ts-ignore
          .mockReturnValueOnce(expectedWhitelistCheck);
        const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397f";

        const { statusCode, body } = await supertest(app).get(
          `/api/whitelist/findAddress/${address}`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedWhitelistCheck);
        expect(createWhitelistServiceMock).toBeCalledTimes(1);
      });
    });

    describe("given address is not whitelisted", () => {
      it("should return the whitelisted account", async () => {
        const createWhitelistServiceMock = jest
          .spyOn(WhitelistService, "findAddress")
          // @ts-ignore
          .mockReturnValueOnce(expectedWhitelistCheckFail);
        const address = "0x981633bc9a25f1411e869e9E8729EedF68Db3cba";

        const { statusCode, body } = await supertest(app).get(
          `/api/whitelist/findAddress/${address}`
        );

        expect(statusCode).toBe(500);
        expect(body).toEqual(expectedWhitelistCheckFail);
        expect(createWhitelistServiceMock).toBeCalledTimes(1);
      });
    });
  });
});

describe("whitelist.findAddress", () => {
  describe("given address is whitelisted", () => {
    it("should return the whitelisted account and success", async () => {
      const whitelistRepoMock = jest
        .spyOn(WhitelistRepo, "findWhitelistedAccount")
        // @ts-ignore
        .mockReturnValueOnce(expectedAccModelFound);

      const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397f";
      const responseData: IResponseMessage = await WhitelistService.findAddress(
        address
      );

      expect(responseData).toEqual(expectedResponseDataWhitelisted);
      expect(whitelistRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given address is not whitelisted", () => {
    it("should return null in data field and success false", async () => {
      const whitelistRepoMock = jest
        .spyOn(WhitelistRepo, "findWhitelistedAccount")
        // @ts-ignore
        .mockReturnValueOnce(null);

      const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397f";
      const responseData: IResponseMessage = await WhitelistService.findAddress(
        address
      );

      expect(responseData).toEqual(expectedResponseDataNotWhitelisted);
      expect(whitelistRepoMock).toBeCalledTimes(1);
    });
  });
});
