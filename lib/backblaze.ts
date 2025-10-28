import { S3Client } from '@aws-sdk/client-s3';

/**
 * Backblaze B2 Configuration
 * 
 * This module provides a centralized S3-compatible client for Backblaze B2 storage.
 * The client is configured using environment variables and is used for media uploads.
 */

// Environment variables for Backblaze B2
const backblazeKeyId = process.env.BACKBLAZE_KEY_ID;
const backblazeAppKey = process.env.BACKBLAZE_APPLICATION_KEY;
const backblazeBucket = process.env.BACKBLAZE_BUCKET_NAME;
const backblazeEndpoint = process.env.BACKBLAZE_ENDPOINT;
const mediaBaseCdnUrl = process.env.NEXT_PUBLIC_MEDIA_CDN_URL;

/**
 * Check if Backblaze B2 is configured
 * @returns true if all required environment variables are set
 */
export function isB2Configured(): boolean {
  return !!(backblazeKeyId && backblazeAppKey && backblazeBucket && backblazeEndpoint);
}

/**
 * Get Backblaze B2 bucket name
 * @returns The configured bucket name or null if not configured
 */
export function getB2BucketName(): string | null {
  return backblazeBucket || null;
}

/**
 * Get media CDN base URL
 * @returns The CDN base URL or null if not configured
 */
export function getMediaCdnUrl(): string | null {
  return mediaBaseCdnUrl || null;
}

/**
 * Create and return an S3Client configured for Backblaze B2
 * @returns S3Client instance or null if not configured
 */
export function getB2Client(): S3Client | null {
  if (!isB2Configured()) {
    return null;
  }

  return new S3Client({
    endpoint: `https://${backblazeEndpoint}`,
    region: 'us-west-004',
    credentials: {
      accessKeyId: backblazeKeyId!,
      secretAccessKey: backblazeAppKey!
    }
  });
}

/**
 * Singleton instance of the B2 client
 * This is created once and reused across the application
 */
let b2ClientInstance: S3Client | null = null;

/**
 * Get the singleton B2 client instance
 * @returns S3Client instance or null if not configured
 */
export function getB2ClientSingleton(): S3Client | null {
  if (b2ClientInstance === null && isB2Configured()) {
    b2ClientInstance = getB2Client();
  }
  return b2ClientInstance;
}

/**
 * Build the full CDN URL for a file
 * @param fileName - The file name/path in the bucket
 * @returns Full CDN URL or null if CDN URL is not configured
 */
export function buildMediaUrl(fileName: string): string | null {
  if (!mediaBaseCdnUrl) {
    return null;
  }
  return `${mediaBaseCdnUrl}/${fileName}`;
}
