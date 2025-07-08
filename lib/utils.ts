import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(
  file: File,
  user: { id: string },
  language = "en"
) {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const baseUrl = process.env.AWS_CDN_URL;
  if (!file) throw new Error("File not found");
  if (file.size > 25 * 1024 * 1024) throw new Error("File size exceeds 25MB");

  const key = `uploads/${user.id}/${Date.now()}-${file.name}`;

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);
  return {
    key,
    url: baseUrl
      ? `${baseUrl}/${key}`
      : `https://${bucket}.s3.amazonaws.com/${key}`,
    mimetype: file.type,
    originalname: file.name,
  };
}
