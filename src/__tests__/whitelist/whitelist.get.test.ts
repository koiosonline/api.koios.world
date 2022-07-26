import supertest from "supertest";
import { app } from "../../index";
import * as WhitelistService from "../../api/services/whiteListService";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";

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
