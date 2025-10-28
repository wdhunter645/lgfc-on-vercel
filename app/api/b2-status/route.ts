import { NextResponse } from 'next/server';
import { isB2Configured, getB2BucketName, getMediaCdnUrl } from '@/lib/backblaze';

/**
 * API endpoint to check Backblaze B2 connection status
 * GET /api/b2-status
 * 
 * Returns the configuration status of Backblaze B2 without exposing sensitive credentials
 */
export async function GET() {
  const configured = isB2Configured();
  const bucketName = getB2BucketName();
  const cdnUrl = getMediaCdnUrl();

  return NextResponse.json({
    configured,
    bucketName: configured ? bucketName : null,
    cdnBaseUrl: configured ? cdnUrl : null,
    message: configured 
      ? 'Backblaze B2 is properly configured' 
      : 'Backblaze B2 is not configured. Please set the required environment variables.'
  });
}
