import supertest from "supertest";
import { app } from "../../index";
import * as WhitelistService from "../../api/services/whiteListService";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";

const expectedDyamicWhitelistExists: IResponseMessage = {
  success: true,
  message: "Address is whitelisted",
  data: {
    address: "0x981633bc9a25f1411e869e9E8729EedF68Db397b",
    type: 0,
    dateAchieved: 1234,
  },
};

describe("whitelist", () => {
  describe("[---get whitelisted dynamic address---]", () => {
    describe("given address is whitelisted", () => {
      it("should return the whitelisted account", async () => {
        const whitelistServiceMock = jest
          .spyOn(WhitelistService, "findWhitelistedAddress")
          // @ts-ignore
          .mockReturnValue(expectedDyamicWhitelistExists);

        const address = "0x981633bc9a25f1411e869e9E8729EedF68Db397b";

        const { statusCode, body } = await supertest(app).get(
          `/api/whitelist/getWhitelistedAddress/${address}`
        );

        console.log(body);

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedDyamicWhitelistExists);
        expect(whitelistServiceMock).toBeCalledTimes(1);
      });
    });
  });
});
