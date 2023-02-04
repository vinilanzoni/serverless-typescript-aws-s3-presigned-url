import serverless from "serverless-http";
import express, { Request, Response } from 'express';
import { addAsync } from '@awaitjs/express';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const app = addAsync(express());

const client = new S3Client({ 
  region: "us-east-1",
});

async function getSignedFileUrl(fileName: string, bucket: string, expiresIn: number) {
  // Instantiate the GetObject command,
  // a.k.a. specific the bucket and key
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  // await the signed URL and return it
  return await getSignedUrl(client, command, { expiresIn });
}

app.getAsync('/', async (req: Request, res: Response) => {
  const presignedUrl = await getSignedFileUrl("PATH", "BUCKET", 3600);
  res.send({ presignedUrl });
});

module.exports.handler = serverless(app);
