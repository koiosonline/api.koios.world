import { retrieveClient } from "./S3Client";
import { findMetadataERC1155 } from "../../repositories/LayerRepo";
import IERC1155MetadataModel from "../../interfaces/Schemas/IERC1155MetadataModel";
import sharp from "sharp";
import axios from "axios";

const addImagesToArray = async (
  ownerType: number,
  imagesMetadata: IERC1155MetadataModel[]
) => {
  let images: any[] = [];

  const bgresponse = await axios.get(
    ownerType === 0
      ? `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Cryp.png`
      : `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Trade.png`,
    {
      responseType: "arraybuffer",
    }
  );
  const bgbuffer = Buffer.from(bgresponse.data, "base64");

  images.push({ input: bgbuffer });
  for (const imageMetadata of imagesMetadata) {
    const image = await axios.get(imageMetadata.image, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(image.data, "base64");
    images.push({ input: buffer });
  }
  return images;
};

export const generateImage = async (
  tokens: number[],
  tokenId: number,
  ownerType: number
): Promise<boolean> => {
  try {
    const imagesMetadata = await loadImages(tokens);
    const images = await addImagesToArray(ownerType, imagesMetadata);

    const sharpDing = await sharp({
      create: {
        width: 2000,
        height: 2000,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(images)
      .png()
      .toBuffer();

    const saveObjectResult = await saveObject(tokenId, sharpDing);
    if (saveObjectResult.httpStatusCode === 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
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

const saveObject = async (tokenId: number, generatedImage: Buffer) => {
  try {
    const s3Client = await retrieveClient();

    const bucketParams = {
      Bucket: "koios-titans",
      Key: `${process.env.SPACES_ENV}/titans/${tokenId}.png`,
      Body: generatedImage,
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
