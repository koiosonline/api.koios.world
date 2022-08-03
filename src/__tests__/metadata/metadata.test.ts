import supertest from "supertest";
import { app } from "../../index";
import * as DynamicNFTRepo from "../../api/repositories/DynamicNFTRepo";
import * as LayerRepo from "../../api/repositories/LayerRepo";
import IERC721MetadataModel from "../../api/interfaces/Schemas/IERC721MetadataModel";

const expectedResponseGet: IERC721MetadataModel = {
  tokenId: 1,
  name: "Unknown Titan",
  image:
    "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Cryp.png",
  description: "This is a fresh Titan with no back story.",
  external_url: "https://nfts.koios.world",
  attributes: [{ trait_type: "Background", value: "Blockchain" }],
};

const expectedResponseGetAll: IERC721MetadataModel[] = [
  {
    tokenId: 1,
    name: "Unknown Titan",
    image:
      "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Cryp.png",
    description: "This is a fresh Titan with no back story.",
    external_url: "https://nfts.koios.world",
    attributes: [{ trait_type: "Background", value: "Blockchain" }],
  },
  {
    tokenId: 1,
    name: "Unknown Titan",
    image:
      "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Cryp.png",
    description: "This is a fresh Titan with no back story.",
    external_url: "https://nfts.koios.world",
    attributes: [{ trait_type: "Background", value: "Blockchain" }],
  },
];

describe("metadata", () => {
  describe("[---get metadata route erc721---]", () => {
    describe("given the metadata does exist", () => {
      it("should return the metadata", async () => {
        const dynamicNFTRepoMock = jest
          .spyOn(DynamicNFTRepo, "findMetadata")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseGet);

        const { statusCode, body } = await supertest(app).get(
          `/api/metadata/erc721/1.json`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedResponseGet);
      });
    });

    describe("given the metadata does not exist", () => {
      it("should return with an internal server error", async () => {
        const { statusCode, text } = await supertest(app).get(
          `/api/metadata/erc721/42069.json`
        );

        expect(statusCode).toBe(500);
        expect(text).toEqual("Non-Existent Metadata");
      });
    });

    describe("given the parameters are incorrect", () => {
      it("should return with a bad request", async () => {
        const { statusCode, text } = await supertest(app).get(
          `/api/metadata/erc721/f`
        );

        expect(statusCode).toBe(400);
        expect(text).toEqual("Bad Request");
      });
    });
  });

  describe("[---get metadata route erc1155---]", () => {
    describe("given the metadata does exist", () => {
      it("should return the metadata", async () => {
        const layerRepoMock = jest
          .spyOn(LayerRepo, "findMetadataERC1155")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseGet);

        const { statusCode, body } = await supertest(app).get(
          `/api/metadata/erc1155/1.json`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedResponseGet);
        expect(layerRepoMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("given the metadata does not exist", () => {
      it("should return with an internal server error", async () => {
        const { statusCode, text } = await supertest(app).get(
          `/api/metadata/erc1155/42069.json`
        );

        expect(statusCode).toBe(500);
        expect(text).toEqual("Non-Existent Metadata");
      });
    });

    describe("given the parameters are incorrect", () => {
      it("should return with a bad request", async () => {
        const { statusCode, text } = await supertest(app).get(
          `/api/metadata/erc1155/f`
        );

        expect(statusCode).toBe(400);
        expect(text).toEqual("Bad Request");
      });
    });
  });

  describe("[---get all erc1155---]", () => {
    describe("given tokens get returned", () => {
      it("should return all tokens", async () => {
        const layerRepoMock = jest
          .spyOn(LayerRepo, "findAll")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseGetAll);

        const { statusCode, body } = await supertest(app).get(
          `/api/metadata/erc1155/`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedResponseGetAll);
        expect(layerRepoMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("given request fails", () => {
    it("should enter catch and return bad request", async () => {
      const layerRepoMock = jest
        .spyOn(LayerRepo, "findAll")
        // @ts-ignore
        .mockRejectedValue();

      const { statusCode, text } = await supertest(app).get(
        `/api/metadata/erc1155/`
      );

      expect(statusCode).toBe(400);
      expect(text).toEqual("Bad Request");
    });
  });
});
