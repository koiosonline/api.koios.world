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
  await drawBackground(ownerType);
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
    await unlinkImage(tokenId);
    return true;
  } else {
    ctxMain.clearRect(0, 0, 1000, 1000);
    await unlinkImage(tokenId);
    return false;
  }
};

const drawBackground = async (ownerType: number) => {
  const background = await loadImage(
    ownerType === 0
      ? "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Cryp.png"
      : "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Trade.png"
  );
  ctxMain.drawImage(background, 0, 0, 1000, 1000);
};

const drawElement = async (image: any, mainCanvas: any) => {
  const layerCanvas = createCanvas(1000, 1000);
  const layerctx = layerCanvas.getContext("2d");

  layerctx.drawImage(image, 0, 0, 1000, 1000);

  mainCanvas.drawImage(layerCanvas, 0, 0, 1000, 1000);
  return layerCanvas;
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
    saveImage(tokenId);

    const bucketParams = {
      Bucket: "koios-titans",
      Key: `titans/images/${tokenId}.png`,
      Body: fs.createReadStream(`tmp/${tokenId}.png`),
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

const saveImage = (tokenId: number) => {
  fs.writeFileSync(`tmp/${tokenId}.png`, canvas.toBuffer("image/png"));
};

const unlinkImage = async (tokenId: number) => {
  fs.unlink(`tmp/${tokenId}.png`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Image deleted locally");
    }
  });
};
