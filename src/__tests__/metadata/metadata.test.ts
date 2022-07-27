import supertest from "supertest";
import { app } from "../../index";
import * as MetadataController from "../../api/controllers/MetadataController";
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

describe("metadata", () => {
  describe("[---get metadata route---]", () => {
    describe("given the metadata does exist", () => {
      it("should return the metadata", async () => {
        const createMetadataControllerMock = jest
          .spyOn(MetadataController, "retrieveMetadata")
          // @ts-ignore
          .mockReturnValueOnce(expectedResponseGet);

        const { statusCode, body } = await supertest(app).get(
          `/api/metadata/1.json`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedResponseGet);
      });
    });

    describe("given the metadata does not exist", () => {
      it("should return with an internal server error", async () => {
        const { statusCode, text } = await supertest(app).get(
          `/api/metadata/42069.json`
        );

        expect(statusCode).toBe(500);
        expect(text).toEqual("Non-Existent Metadata");
      });
    });

    describe("given the parameters are incorrect", () => {
      it("should return with a bad request", async () => {
        const { statusCode, text } = await supertest(app).get(
          `/api/metadata/f`
        );

        expect(statusCode).toBe(400);
        expect(text).toEqual("Bad Request");
      });
    });
  });
});
