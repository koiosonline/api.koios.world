import supertest from "supertest";
import { app } from "../../index";
import * as DynamicNFTService from "../../api/services/DynamicNFTService";
import * as DynamicNFTRepo from "../../api/repositories/DynamicNFTRepo";
import * as SignatureVerificationService from "../../api/services/util/SignatureVerificationService";
import * as GenerationImageService from "../../api/services/util/ImageService";
import * as LayerRepo from "../../api/repositories/LayerRepo";
import { IResponseMessage } from "../../api/interfaces/IResponseMessage";
import IEvolveModel from "../../api/interfaces/IEvolveModel";
import IERC1155MetadataModel from "../../api/interfaces/Schemas/IERC1155MetadataModel";
import IERC721MetadataModel from "../../api/interfaces/Schemas/IERC721MetadataModel";

const expectedEvolveResponse: IResponseMessage = {
  success: true,
  message: "Successfully evolved!",
  data: [],
};

const sendModel: IEvolveModel = {
  saltHash: "lol",
  signature: "test",
  model: {
    tokenId: 0,
    name: "test",
    description: "test",
    image: "test",
    external_url: "test",
    attributes: [],
  },
  tokens: [1, 2, 3],
};

const updatedModel: IERC721MetadataModel = {
  tokenId: 0,
  name: "test",
  description: "test",
  image: "test",
  external_url: "test",
  attributes: [
    {
      trait_type: "Background",
      value: "Blockchain",
    },
    {
      trait_type: "token",
      value: "one",
    },
    {
      trait_type: "token",
      value: "two",
    },
    {
      trait_type: "token",
      value: "three",
    },
  ],
};

const token_1: IERC1155MetadataModel = {
  tokenId: 1,
  name: "test",
  description: "test",
  image: "test",
  external_url: "test",
  attributes: [
    {
      trait_type: "token",
      value: "one",
    },
  ],
};

const token_2: IERC1155MetadataModel = {
  tokenId: 2,
  name: "test",
  description: "test",
  image: "test",
  external_url: "test",
  attributes: [
    {
      trait_type: "token",
      value: "two",
    },
  ],
};

const token_3: IERC1155MetadataModel = {
  tokenId: 3,
  name: "test",
  description: "test",
  image: "test",
  external_url: "test",
  attributes: [
    {
      trait_type: "token",
      value: "three",
    },
  ],
};

describe("dynamicNFT", () => {
  describe("[---evolve NFT---]", () => {
    describe("given caller owns the NFTs & successfully generated", () => {
      it("should return success response", async () => {
        const SignatureVerificationServiceMockDynamicNFT = jest
          .spyOn(SignatureVerificationService, "verifyDynamicNFTOwnership")
          // @ts-ignore
          .mockReturnValue(true);

        const SignatureVerificationServiceMockLayers = jest
          .spyOn(SignatureVerificationService, "verifyMessageForOwnedLayers")
          // @ts-ignore
          .mockReturnValue(true);

        const DynamicNFTServiceMock = jest
          .spyOn(DynamicNFTService, "evolveNFT")
          // @ts-ignore
          .mockReturnValue(expectedEvolveResponse);

        const { statusCode, body } = await supertest(app)
          .post(`/api/DynamicNFT/evolve`)
          .send({
            saltHash: "lol",
            signature: "test",
            model: {},
            tokens: [1, 2, 3],
          });

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedEvolveResponse);
        expect(DynamicNFTServiceMock).toBeCalledTimes(1);
      });
    });

    describe("given data is passed on correctly", () => {
      it("should generate an evolved image and return it", async () => {
        const SignatureVerificationServiceMockSignature = jest
          .spyOn(SignatureVerificationService, "getAddressFromSignature")
          // @ts-ignore
          .mockReturnValue("0x123");

        const DynamicNFTRepoWhitelistMock = jest
          .spyOn(DynamicNFTRepo, "findExistingWhitelist")
          // @ts-ignore
          .mockReturnValue({ address: "0x123", type: 0 });

        const GenerateImageServiceMock = jest
          .spyOn(GenerationImageService, "generateImage")
          // @ts-ignore
          .mockReturnValue(true);

        const LayerRepoMock = jest
          .spyOn(LayerRepo, "findMetadataERC1155")
          // @ts-ignore
          .mockReturnValueOnce(token_1)
          // @ts-ignore
          .mockReturnValueOnce(token_2)
          // @ts-ignore
          .mockReturnValueOnce(token_3);

        const DynamicNFTRepoUpdateMock = jest
          .spyOn(DynamicNFTRepo, "updateMetadata")
          // @ts-ignore
          .mockReturnValue(updatedModel);

        const expectedResponse: IResponseMessage = {
          success: true,
          message: "Successfully evolved!",
          data: updatedModel,
        };
        const actualResponse = await DynamicNFTService.evolveNFT(
          sendModel,
          "0x123",
          "lol"
        );

        expect(actualResponse).toEqual(expectedResponse);
        expect(LayerRepoMock).toBeCalledTimes(3);
        expect(DynamicNFTRepoWhitelistMock).toBeCalledTimes(1);
        expect(DynamicNFTRepoUpdateMock).toBeCalledTimes(1);
        expect(GenerateImageServiceMock).toBeCalledTimes(1);
      });
    });
  });
});
