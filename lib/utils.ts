import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resend } from 'resend';
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
 
  // sign the url for 7 days
  const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  }), { expiresIn: 60 * 60 * 24 * 7 }); // 7 days

  return {
    key,
    url: signedUrl,
    mimetype: file.type,
    originalname: file.name,
  };
}

// Rename the local function to avoid import conflict
export async function getS3SignedUrl(key: string): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  }), { expiresIn: 60 * 15 });// 15 minutes

  console.log("signedUrl", signedUrl)
  return signedUrl;
}

  export async function postResend(from: string, to: string, subject: string, body: string): Promise<boolean> {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html: body,
    });
    return response && !response.error;
  }
