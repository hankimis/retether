export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

const inputSchema = z.object({
  key: z.string().min(1),
  contentType: z.string().min(1),
});

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    : undefined,
});

export async function POST(req: Request) {
  const session = (await getServerSession(authConfig as any)) as any;
  const role = (session?.user as any)?.role ?? "USER";
  if (role !== "ADMIN" && role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { key, contentType } = parsed.data;
  const bucket = process.env.AWS_S3_BUCKET!;
  if (!bucket) {
    return NextResponse.json({ error: "Missing AWS_S3_BUCKET" }, { status: 500 });
  }

  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  return NextResponse.json({ url, key, bucket });
}


