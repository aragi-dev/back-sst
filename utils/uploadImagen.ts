import { Resource } from "sst";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client();

export async function uploadImageToS3(
  buffer: Buffer,
  key: string,
  contentType = "image/png",
  bucketName: string = Resource.QrBucket.name
): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 24 });
  return url;
}
