import supertest from "supertest";
import { app } from "../index";
import * as WhitelistService from "../api/services/whiteListService";
import * as SignatureVerificationService from "../api/services/util/SignatureVerificationService";
import * as WhitelistRepo from "../api/repositories/WhitelistRepo";
import { IResponseMessage } from "../api/interfaces/IResponseMessage";
import IERC721ClaimModel from "../api/interfaces/Schemas/IERC721ClaimModel";
import IUploadModel from "../api/interfaces/IUploadModel";
import { signature } from "../api/controllers/MintController";

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

const expectedSingleWhitelistUpload: IResponseMessage = {
  success: true,
  message: "Address whitelisted successfully",
  data: {
    address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
    type: 0,
    dateAchieved: 1234,
  },
};

const expectedSingleWhitelistUploadExists: IResponseMessage = {
  success: false,
  error: true,
  message: "Address already whitelisted",
  data: {
    address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
    type: 0,
    dateAchieved: 1234,
  },
};

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

  describe("[---upload whitelisted address(es)---]", () => {
    describe("[--given single upload route is called--]", () => {
      describe("[-given signature is valid and whitelisted-]", () => {
        describe("given address is not in dynamic nft whitelist", () => {
          it("should return successfully whitelisted account response", async () => {
            const createWhitelistServiceMock = jest
              .spyOn(WhitelistService, "uploadSingle")
              // @ts-ignore
              .mockReturnValueOnce(expectedSingleWhitelistUpload);
            const verificationServiceMock = jest
              .spyOn(SignatureVerificationService, "verifyMessage")
              // @ts-ignore
              .mockReturnValueOnce(true);

            const uploadModel: IERC721ClaimModel = {
              address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
              type: 0,
              dateAchieved: 1234,
            };

            const modelToUpload: IUploadModel = {
              saltHash: "lol",
              signature: "test",
              data: uploadModel,
            };

            const { statusCode, body } = await supertest(app)
              .post(`/api/whitelist/uploadSingle`)
              .send(modelToUpload);

            expect(statusCode).toBe(200);
            expect(body).toEqual(expectedSingleWhitelistUpload);
            expect(verificationServiceMock).toBeCalledTimes(1);
            expect(createWhitelistServiceMock).toBeCalledTimes(1);
          });
        });

        describe("given address is in dynamic nft whitelist", () => {
          it("should return with already whitelisted response", async () => {
            const verificationServiceMock = jest
              .spyOn(SignatureVerificationService, "verifyMessage")
              // @ts-ignore
              .mockReturnValueOnce(true);

            const whitelistRepoMock = jest
              .spyOn(WhitelistRepo, "findExistingWhitelist")
              // @ts-ignore
              .mockReturnValue(expectedSingleWhitelistUpload);

            const uploadModel: IERC721ClaimModel = {
              address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
              type: 0,
              dateAchieved: 1234,
            };

            const modelToUpload: IUploadModel = {
              saltHash: "lol",
              signature: "test",
              data: uploadModel,
            };

            const { statusCode, body } = await supertest(app)
              .post(`/api/whitelist/uploadSingle`)
              .send(modelToUpload);

            expect(statusCode).toBe(200);
            expect(body).toEqual(expectedSingleWhitelistUploadExists);
            expect(verificationServiceMock).toBeCalledTimes(1);
          });
        });
      });
      describe("[-given signature address is not whitelisted-]", () => {
        it("should return with 401 error", async () => {
          const createWhitelistServiceMock = jest
            .spyOn(WhitelistService, "uploadSingle")
            // @ts-ignore
            .mockReturnValueOnce(expectedSingleWhitelistUpload);

          const verificationServiceMock = jest
            .spyOn(SignatureVerificationService, "verifyMessage")
            // @ts-ignore
            .mockReturnValueOnce(false);

          const uploadModel: IERC721ClaimModel = {
            address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
            type: 0,
            dateAchieved: 1234,
          };

          const modelToUpload: IUploadModel = {
            saltHash: "invalid",
            signature: "invalid",
            data: uploadModel,
          };

          const { statusCode, body } = await supertest(app)
            .post(`/api/whitelist/uploadSingle`)
            .send(modelToUpload);

          expect(statusCode).toBe(401);
          expect(body).toEqual({
            success: false,
            error: true,
            message: "Account not whitelisted",
          });
          expect(verificationServiceMock).toBeCalledTimes(1);
          expect(createWhitelistServiceMock).toHaveBeenCalledTimes(0);
        });
      });
      describe("[-given no signature is given-]", () => {
        it("should return with 400 error", async () => {
          const createWhitelistServiceMock = jest
            .spyOn(WhitelistService, "uploadSingle")
            // @ts-ignore
            .mockReturnValueOnce(expectedSingleWhitelistUpload);

          const uploadModel: IERC721ClaimModel = {
            address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
            type: 0,
            dateAchieved: 1234,
          };

          const modelToUpload = {
            data: uploadModel,
          };

          const { statusCode, text } = await supertest(app)
            .post(`/api/whitelist/uploadSingle`)
            .send(modelToUpload);

          expect(statusCode).toBe(400);
          expect(text).toEqual("Bad Request");
          expect(createWhitelistServiceMock).toHaveBeenCalledTimes(0);
        });
      });
    });
  });

  //     describe("given address is whitelisted for Dynamic NFT claim", () => {
  //       it("should return the whitelisted account", async () => {
  //         const createWhitelistServiceMock = jest
  //           .spyOn(WhitelistService, "findAddress")
  //           // @ts-ignore
  //           .mockReturnValueOnce(expectedWhitelistCheck);
  //         const address = "0x1234567890123456789012345678901234567890";

  //         const { statusCode, body } = await supertest(app).get(
  //           `/api/whitelist/getWhitelistedAddress/${address}`
  //         );

  //         expect(statusCode).toBe(200);
  //         expect(body).toEqual(expectedWhitelistCheck);
  //         expect(createWhitelistServiceMock).toBeCalledTimes(1);
  //       });
  //     });
  //   });

  //   describe("[---get whitelisted address---]", () => {
  //     describe("given address is whitelisted", () => {
  //       it("should return the whitelisted account", async () => {
  //         const createWhitelistServiceMock = jest
  //           .spyOn(WhitelistService, "findAddress")
  //           // @ts-ignore
  //           .mockReturnValueOnce(expectedWhitelistCheck);
  //         const address = "0x1234567890123456789012345678901234567890";

  //         const { statusCode, body } = await supertest(app).get(
  //           `/api/whitelist/findAddress/${address}`
  //         );

  //         expect(statusCode).toBe(200);
  //         expect(body).toEqual(expectedWhitelistCheck);
  //         expect(createWhitelistServiceMock).toBeCalledTimes(1);
  //       });
  //     });
});
