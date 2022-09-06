import supertest from "supertest";
import { app } from "../../index";
import * as DynamicNFTService from "../../api/services/DynamicNFTService";
import * as SignatureVerificationService from "../../api/services/util/SignatureVerificationService";
import * as DynamicNFTRepo from "../../api/repositories/DynamicNFTRepo";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IERC721ClaimModel from "../../api/interfaces/Schemas/IERC721ClaimModel";
import IUploadModel from "../../api/interfaces/IUploadModel";

const expectedMultipleWhitelistUpload: IResponseMessage = {
  success: true,
  message: "Addresses whitelisted successfully",
  data: [
    {
      address: "a",
      type: 0,
      dateAchieved: 1234,
    },
    {
      address: "b",
      type: 1,
      dateAchieved: 1234,
    },
    {
      address: "c",
      type: 0,
      dateAchieved: 1234,
    },
  ],
};

const expectedMultipleWhitelistUploadExistingAddress: IResponseMessage = {
  success: true,
  message: "Addresses whitelisted successfully",
  data: [
    {
      address: "b",
      type: 1,
      dateAchieved: 1234,
    },
    {
      address: "c",
      type: 0,
      dateAchieved: 1234,
    },
  ],
};

const uploadModel: IERC721ClaimModel[] = [
  {
    address: "a",
    type: 0,
    dateAchieved: 1234,
  },
  {
    address: "b",
    type: 1,
    dateAchieved: 1234,
  },
  {
    address: "c",
    type: 0,
    dateAchieved: 1234,
  },
];

describe("dynamicNFT", () => {
  describe("[---upload multiple addresses---]", () => {
    describe("[--given signature is valid and caller is whitelisted--]", () => {
      describe("given all addresses are not in dynamic nft whitelist", () => {
        it("should return successfully whitelisted accounts response", async () => {
          const createDynamicNFTServiceMock = jest
            .spyOn(DynamicNFTService, "uploadMultiple")
            // @ts-ignore
            .mockReturnValueOnce(expectedMultipleWhitelistUpload);

          const verificationServiceMock = jest
            .spyOn(SignatureVerificationService, "verifyMessage")
            // @ts-ignore
            .mockReturnValueOnce(true);

          const modelToUpload: IUploadModel = {
            saltHash: "lol",
            signature: "test",
            data: uploadModel,
          };

          const { statusCode, body } = await supertest(app)
            .post(`/api/dynamicNFT/uploadMultiple`)
            .send(modelToUpload);

          expect(statusCode).toBe(200);
          expect(body).toEqual(expectedMultipleWhitelistUpload);
          expect(verificationServiceMock).toBeCalledTimes(1);
          expect(createDynamicNFTServiceMock).toBeCalledTimes(1);
        });
      });

      describe("given some addresses are in dynamic nft whitelist", () => {
        it("should return only added addresses in data response", async () => {
          const createDynamicNFTServiceMock = jest
            .spyOn(DynamicNFTService, "uploadMultiple")
            // @ts-ignore
            .mockReturnValue(expectedMultipleWhitelistUploadExistingAddress);

          const verificationServiceMock = jest
            .spyOn(SignatureVerificationService, "verifyMessage")
            // @ts-ignore
            .mockReturnValueOnce(true);

          const addressModel: IERC721ClaimModel = {
            address: "a",
            type: 0,
            dateAchieved: 1234,
          };

          const DynamicNFTRepoMock = jest
            .spyOn(DynamicNFTRepo, "findExistingWhitelist")
            // @ts-ignore
            .mockReturnValueOnce(addressModel);

          const modelToUpload: IUploadModel = {
            saltHash: "lol",
            signature: "test",
            data: uploadModel,
          };

          const { statusCode, body } = await supertest(app)
            .post(`/api/dynamicNFT/uploadMultiple`)
            .send(modelToUpload);

          expect(statusCode).toBe(200);
          expect(body).toEqual(expectedMultipleWhitelistUploadExistingAddress);
          expect(verificationServiceMock).toBeCalledTimes(1);
          expect(createDynamicNFTServiceMock).toBeCalledTimes(1);
        });
      });
    });
  });

  describe("[--given signature address is not whitelisted--]", () => {
    it("should return with 401 error", async () => {
      const createDynamicNFTServiceMock = jest
        .spyOn(DynamicNFTService, "uploadMultiple")
        // @ts-ignore
        .mockReturnValueOnce(null);

      const verificationServiceMock = jest
        .spyOn(SignatureVerificationService, "verifyMessage")
        // @ts-ignore
        .mockReturnValueOnce(false);

      const modelToUpload: IUploadModel = {
        saltHash: "invalid",
        signature: "invalid",
        data: uploadModel,
      };

      const { statusCode, body } = await supertest(app)
        .post(`/api/dynamicNFT/uploadMultiple`)
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
        .mockReturnValueOnce(null);

      const modelToUpload = {
        data: uploadModel,
      };

      const { statusCode, text } = await supertest(app)
        .post(`/api/dynamicNFT/uploadMultiple`)
        .send(modelToUpload);

      expect(statusCode).toBe(400);
      expect(text).toEqual("Bad Request");
      expect(createDynamicNFTServiceMock).toHaveBeenCalledTimes(0);
    });
  });
});

describe("dynamicNFT.uploadMultiple", () => {
  describe("given all addresses have not been whitelisted yet", () => {
    it("should create the models and return them in the data field", async () => {
      const findExistingDynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(null);

      const createDynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "createWhitelist")
        // @ts-ignore
        .mockReturnValueOnce(uploadModel[0])
        // @ts-ignore
        .mockReturnValueOnce(uploadModel[1])
        // @ts-ignore
        .mockReturnValueOnce(uploadModel[2]);

      const expectedResponse: IResponseMessage =
        expectedMultipleWhitelistUpload;

      const actualResponse = await DynamicNFTService.uploadMultiple(
        uploadModel
      );

      expect(actualResponse).toEqual(expectedResponse);
      expect(findExistingDynamicNFTRepoMock).toBeCalledTimes(3);
      expect(createDynamicNFTRepoMock).toBeCalledTimes(3);
    });
  });

  describe("given some addresses have been whitelisted", () => {
    it("should create the models and return them in the data field", async () => {
      const findExistingWhitelistMock = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue(null)
        // @ts-ignore
        .mockReturnValueOnce(uploadModel[0]);

      const createDynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "createWhitelist")
        // @ts-ignore
        .mockReturnValueOnce(uploadModel[1])
        // @ts-ignore
        .mockReturnValueOnce(uploadModel[2]);

      const expectedResponse: IResponseMessage =
        expectedMultipleWhitelistUploadExistingAddress;

      const actualResponse = await DynamicNFTService.uploadMultiple(
        uploadModel
      );

      expect(actualResponse).toEqual(expectedResponse);
      expect(findExistingWhitelistMock).toBeCalledTimes(3);
      expect(createDynamicNFTRepoMock).toBeCalledTimes(2);
    });
  });
});
