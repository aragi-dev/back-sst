import { Resource } from "sst";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client();

export async function uploadQrImage(buffer: Buffer, key: string): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: Resource.QrBucket.name,
    Key: key,
    Body: buffer,
    ContentType: "image/png",
  }));

  const command = new GetObjectCommand({
    Bucket: Resource.QrBucket.name,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 15 });

  return url;
}
