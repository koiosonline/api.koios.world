import supertest from "supertest";
import { app } from "../../index";
import * as DynamicNFTRepo from "../../api/repositories/DynamicNFTRepo";
import * as DynamicNFTService from "../../api/services/DynamicNFTService";
import IERC721MetadataModel from "../../api/interfaces/Schemas/IERC721MetadataModel";

const expectedReturnedMetadata2: IERC721MetadataModel = {
  tokenId: 2,
  name: "Unknown Titan",
  image: `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Trade.png`,
  description: "This is a fresh Titan with no back story.",
  external_url: "https://nfts.koios.world",
  attributes: [{ trait_type: "Background", value: "TDFA" }],
};

describe("dynamicNFT", () => {
  beforeAll(async () => {
    // Clear database documents
    await DynamicNFTRepo.deleteAll();
  });
  describe("given there is no token in the database", () => {
    it("should create one new metadata doc", async () => {
      const DynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "getAllMetadataDocsSorted")
        // @ts-ignore
        .mockReturnValue([]);

      const DynamicNFTRepoMockFindAddress = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue({
          // @ts-ignore
          address: "0x981633bc9a25f1411e869e9E8729EedF68Db397b",
          type: 0,
        });

      const DynamicNFTServiceMockOwnerOf = jest
        .spyOn(DynamicNFTService, "getOwnerOfTokenId")
        // @ts-ignore
        .mockReturnValue("0x981633bc9a25f1411e869e9E8729EedF68Db397b");

      const DynamicNFTServiceMockSupply = jest
        .spyOn(DynamicNFTService, "getTotalSupply")
        // @ts-ignore
        .mockReturnValue(0);

      const createDynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "createWhitelist")
        // @ts-ignore
        .mockReturnValueOnce({
          // @ts-ignore
          address: "0x981633bc9a25f1411e869e9E8729EedF68Db397b",
          type: 0,
          dateAchieved: 1234,
        });

      await DynamicNFTService.watchDynamicNFT();

      const { statusCode, body } = await supertest(app).get(
        `/api/metadata/erc721/1.json`
      );

      expect(statusCode).toEqual(200);
      expect(body).toEqual({
        tokenId: 1,
        name: "Unknown Titan",
        image: `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Cryp.png`,
        description: "This is a fresh Titan with no back story.",
        external_url: "https://nfts.koios.world",
        attributes: [{ trait_type: "Background", value: "Blockchain" }],
      });
    });
  });

  describe("given there is a token in the database", () => {
    it("should create one new metadata doc", async () => {
      const DynamicNFTRepoMock = jest
        .spyOn(DynamicNFTRepo, "getAllMetadataDocsSorted")
        // @ts-ignore
        .mockReturnValue([
          {
            // @ts-ignore
            tokenId: 1,
            name: "Unknown Titan",
            image: `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Cryp.png`,
            description: "This is a fresh Titan with no back story.",
            external_url: "https://nfts.koios.world",
            attributes: [{ trait_type: "Background", value: "Blockchain" }],
          },
        ]);

      const DynamicNFTRepoMockFindAddress = jest
        .spyOn(DynamicNFTRepo, "findExistingWhitelist")
        // @ts-ignore
        .mockReturnValue({
          // @ts-ignore
          address: "0x981633bc9a25f1411e869e9E8729EedF68Db397b",
          type: 1,
        });

      const DynamicNFTRepoMockFindMetadata = jest
        .spyOn(DynamicNFTRepo, "findMetadata")
        // @ts-ignore
        .mockReturnValue(expectedReturnedMetadata2)
        .mockReturnValueOnce(null);

      const DynamicNFTServiceMockOwnerOf = jest
        .spyOn(DynamicNFTService, "getOwnerOfTokenId")
        // @ts-ignore
        .mockReturnValue("0x981633bc9a25f1411e869e9E8729EedF68Db397b");

      const DynamicNFTServiceMockSupply = jest
        .spyOn(DynamicNFTService, "getTotalSupply")
        // @ts-ignore
        .mockReturnValue(2);

      await DynamicNFTService.watchDynamicNFT();

      const { statusCode, body } = await supertest(app).get(
        `/api/metadata/erc721/2.json`
      );

      expect(statusCode).toEqual(200);
      expect(body).toEqual({
        tokenId: 2,
        name: "Unknown Titan",
        image: `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Trade.png`,
        description: "This is a fresh Titan with no back story.",
        external_url: "https://nfts.koios.world",
        attributes: [{ trait_type: "Background", value: "TDFA" }],
      });
    });
  });
});
