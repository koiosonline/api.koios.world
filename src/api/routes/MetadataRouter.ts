import express from "express";
import * as metadataController from "../controllers/MetadataController";
export const metadataRouter = express.Router({ caseSensitive: false });

metadataRouter.route("/erc721/:token").get(metadataController.retrieveMetadata);
metadataRouter
  .route("/ERC1155/:token")
  .get(metadataController.retrieveMetadataERC1155);

metadataRouter.route("/erc1155/").get(metadataController.retrieveAllTokens);
