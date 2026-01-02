import AWS from "aws-sdk";
import config from "../config";
import { InternalServerError } from "../errors/internal-server.error";

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_ID,
  secretAccessKey: config.AWS_SECRET,
  region: config.AWS_REGION,
});

export const uploadToS3 = async (
  file: Express.Multer.File,
  folder = "tapi-tubes/products"
): Promise<string> => {
  try {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    const key = `${folder}/${Date.now()}-${cleanName}`;

    await s3
      .putObject({
        Bucket: config.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return `https://${config.S3_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error("S3 upload failed:", err);
    throw new InternalServerError("Failed to upload image");
  }
};
