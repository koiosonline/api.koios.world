import { createCanvas, loadImage } from "canvas";
import { retrieveClient } from "./S3Client";
import { findMetadataERC1155 } from "../../repositories/LayerRepo";
import IERC1155MetadataModel from "../../interfaces/Schemas/IERC1155MetadataModel";
import fs from "fs";

const canvas = createCanvas(1000, 1000);
const ctxMain = canvas.getContext("2d");

export const generateImage = async (
  tokens: number[],
  tokenId: number,
  ownerType: number
): Promise<boolean> => {
  const background = await drawBackground(ownerType);

  if (background) {
    const imagesMetadata = await loadImages(tokens);

    for (const imageMetadata of imagesMetadata) {
      const image = await loadImage(imageMetadata.image);
      if (image) {
        ctxMain.drawImage(await drawElement(image, ctxMain), 0, 0, 1000, 1000);
      } else {
        console.log("Image not found");
        console.log(imageMetadata.image);
      }
    }

    const saveResponse = await saveObject(tokenId);
    if (saveResponse.httpStatusCode === 200) {
      ctxMain.clearRect(0, 0, 1000, 1000);
      return true;
    } else {
      ctxMain.clearRect(0, 0, 1000, 1000);
      return false;
    }
  }
};

const drawBackground = async (ownerType: number) => {
  const background = await loadImage(
    ownerType === 0
      ? "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Cryp.png"
      : "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Trade.png"
  );
  ctxMain.drawImage(background, 0, 0, 1000, 1000);
  return true;
};

const drawElement = async (image: any, mainCanvas: any) => {
  try {
    const layerCanvas = createCanvas(1000, 1000);
    const layerctx = layerCanvas.getContext("2d");

    layerctx.drawImage(image, 0, 0, 1000, 1000);

    mainCanvas.drawImage(layerCanvas, 0, 0, 1000, 1000);
    return layerCanvas;
  } catch (e) {
    console.log(e);
    return;
  }
};

const loadImages = async (tokens: number[]) => {
  const imagesMetadata: IERC1155MetadataModel[] = [];
  for (const token of tokens) {
    const imageMetadata: IERC1155MetadataModel = await findMetadataERC1155(
      token
    );
    if (imageMetadata) {
      imagesMetadata.push(imageMetadata);
    }
  }
  return imagesMetadata;
};

const saveObject = async (tokenId: number) => {
  try {
    const s3Client = await retrieveClient();
    const image = canvas.toBuffer("image/png");

    const bucketParams = {
      Bucket: "koios-titans",
      Key: `titans/images/${tokenId}.png`,
      Body: image,
      ContentType: "image/png",
      ACL: "public-read",
    };

    const uploadCommand = await s3Client.putObject(bucketParams);
    return uploadCommand.$metadata;
  } catch (err) {
    console.log("Error", err);
    return { httpStatusCode: 500 };
  }
};
