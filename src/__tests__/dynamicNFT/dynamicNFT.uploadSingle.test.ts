import supertest from "supertest";
import { app } from "../../index";
import * as DynamicNFTService from "../../api/services/DynamicNFTService";
import * as SignatureVerificationService from "../../api/services/util/SignatureVerificationService";
import * as DynamicNFTRepo from "../../api/repositories/DynamicNFTRepo";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IERC721ClaimModel from "../../api/interfaces/Schemas/IERC721ClaimModel";
import IUploadModel from "../../api/interfaces/IUploadModel";

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

const expectedSingleWhitelistUploadRepo: IERC721ClaimModel = {
  address: "0x981633bc9a25f1411e869e9E8729EedF68Db397f",
  type: 0,
  dateAchieved: 1234,
};

describe("dynamicNFT", () => {
  describe("[---upload single address---]", () => {
    describe("[--given signature is valid and caller is whitelisted--]", () => {
      describe("given address is not in dynamic nft whitelist", () => {
        it("should return successfully whitelisted account response", async () => {
          const createDynamicNFTServiceMock = jest
            .spyOn(DynamicNFTService, "uploadSingle")
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
            .post(`/api/dynamicNFT/uploadSingle`)
            .send(modelToUpload);

          expect(statusCode).toBe(200);
          expect(body).toEqual(expectedSingleWhitelistUpload);
          expect(verificationServiceMock).toBeCalledTimes(1);
          expect(createDynamicNFTServiceMock).toBeCalledTimes(1);
        });
      });

      describe("given address is in dynamic nft whitelist", () => {
        it("should return with already whitelisted response", async () => {
          const verificationServiceMock = jest
            .spyOn(SignatureVerificationService, "verifyMessage")
            // @ts-ignore
            .mockReturnValueOnce(true);

          const DynamicNFTRepoMock = jest
            .spyOn(DynamicNFTRepo, "findExistingWhitelist")
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
            .post(`/api/dynamicNFT/uploadSingle`)
            .send(modelToUpload);

          expect(statusCode).toBe(200);
          expect(body).toEqual(expectedSingleWhitelistUploadExists);
          expect(verificationServiceMock).toBeCalledTimes(1);
        });
      });
    });
  });

  describe("[--given signature address is not whitelisted--]", () => {
    it("should return with 401 error", async () => {
      const createDynamicNFTServiceMock = jest
        .spyOn(DynamicNFTService, "uploadSingle")
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
        .post(`/api/dynamicNFT/uploadSingle`)
        .send(modelToUpload);

      expect(statusCode).toBe(401);
      expect(body).toEqual({
        success: false,
        error: true,
        message: "Account not whitelisted",
      });
      expect(verificationServiceMock).toBeCalledTimes(1);
      expect(createDynamicNFTServiceMock).toHaveBeenCalledTimes(0);
    });
  });

  describe("[-given no signature is given-]", () => {
    it("should return with 400 error", async () => {
      const createDynamicNFTServiceMock = jest
        .spyOn(DynamicNFTService, "uploadSingle")
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
        .post(`/api/dynamicNFT/uploadSingle`)
        .send(modelToUpload);

      expect(statusCode).toBe(400);
      expect(text).toEqual("Bad Request");
      expect(createDynamicNFTServiceMock).toHaveBeenCalledTimes(0);
    });
  });
});

describe("dynamicNFT.uploadSingle", () => {
  describe("given address has not been whitelisted for the Dynamic Whitelist", () => {
    it("should create the model and return with a success message", async () => {
      const whitelistExistsRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(null);

      const createDynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "createWhitelist")
        // @ts-ignore
        .mockReturnValue(expectedSingleWhitelistUploadRepo);

      const expectedResponse: IResponseMessage = {
        success: true,
        message: "Address whitelisted successfully",
        data: expectedSingleWhitelistUploadRepo,
      };

      const actualResponse: IResponseMessage =
        await DynamicNFTService.uploadSingle(expectedSingleWhitelistUploadRepo);

      expect(actualResponse).toEqual(expectedResponse);
      expect(whitelistExistsRepoMock).toBeCalledTimes(1);
      expect(createDynamicNFTRepoMock).toBeCalledTimes(1);
    });
  });

  describe("given address has been whitelisted for the Dynamic Whitelist", () => {
    it("should return with success false response", async () => {
      const whitelistExistsRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(true);

      const createDynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "createWhitelist")
        // @ts-ignore
        .mockReturnValue(expectedSingleWhitelistUploadRepo);

      const expectedResponse: IResponseMessage = {
        success: false,
        error: true,
        message: "Address already whitelisted",
        data: expectedSingleWhitelistUploadRepo,
      };

      const actualResponse: IResponseMessage =
        await DynamicNFTService.uploadSingle(expectedSingleWhitelistUploadRepo);

      expect(actualResponse).toEqual(expectedResponse);
      expect(whitelistExistsRepoMock).toBeCalledTimes(1);
      expect(createDynamicNFTRepoMock).toBeCalledTimes(0);
    });
  });

  describe("given an error occurs when searching the whitelist", () => {
    it("should return catch with error response", async () => {
      const createDynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockRejectedValue("Error");

      const actualResponse: IResponseMessage =
        await DynamicNFTService.uploadSingle(expectedSingleWhitelistUploadRepo);

      expect(actualResponse).toEqual({
        success: false,
        error: true,
        message: "Whitelist creation/addition failed: \n " + "Error",
      });
    });
  });
});
