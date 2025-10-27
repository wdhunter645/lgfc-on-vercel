import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const backblazeKeyId = process.env.BACKBLAZE_KEY_ID;
const backblazeAppKey = process.env.BACKBLAZE_APPLICATION_KEY;
const backblazeBucket = process.env.BACKBLAZE_BUCKET_NAME;
const backblazeEndpoint = process.env.BACKBLAZE_ENDPOINT;

const s3Client = backblazeKeyId && backblazeAppKey && backblazeEndpoint
  ? new S3Client({
      endpoint: `https://${backblazeEndpoint}`,
      region: 'us-west-004',
      credentials: {
        accessKeyId: backblazeKeyId,
        secretAccessKey: backblazeAppKey
      }
    })
  : null;

export async function POST(request: NextRequest) {
  if (!s3Client || !backblazeBucket) {
    return NextResponse.json(
      { error: 'Storage not configured. Set up Backblaze B2 environment variables.' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: backblazeBucket,
      Key: fileName,
      Body: buffer,
      ContentType: file.type
    }));
    
    const url = `${process.env.NEXT_PUBLIC_MEDIA_CDN_URL}/${fileName}`;
    
    return NextResponse.json({ url, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
