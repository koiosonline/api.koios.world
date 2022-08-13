import { S3 } from "@aws-sdk/client-s3";

export const retrieveClient = async () => {
  const client = await new S3({
    endpoint: process.env.SPACES_URL,
    region: "eu-west-1",
    credentials: {
      accessKeyId: process.env.SPACES_KEY,
      secretAccessKey: process.env.SPACES_SECRET,
    },
  });
  return client;
};
