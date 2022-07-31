import express from "express";
import * as metadataController from "../controllers/MetadataController";
export const metadataRouter = express.Router({ caseSensitive: false });

metadataRouter.route("/:token").get(metadataController.retrieveMetadata);
