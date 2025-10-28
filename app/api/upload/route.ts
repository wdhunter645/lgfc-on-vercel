import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getB2ClientSingleton, getB2BucketName, buildMediaUrl, isB2Configured } from '@/lib/backblaze';

export async function POST(request: NextRequest) {
  // Check if Backblaze B2 is configured
  if (!isB2Configured()) {
    return NextResponse.json(
      { error: 'Storage not configured. Set up Backblaze B2 environment variables.' },
      { status: 503 }
    );
  }

  const s3Client = getB2ClientSingleton();
  const bucketName = getB2BucketName();

  if (!s3Client || !bucketName) {
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
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type
    }));
    
    const url = buildMediaUrl(fileName);
    
    if (!url) {
      return NextResponse.json({ error: 'CDN URL not configured' }, { status: 500 });
    }
    
    return NextResponse.json({ url, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
