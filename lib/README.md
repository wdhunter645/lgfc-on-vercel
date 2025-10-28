# Library Directory

This directory contains shared utilities and configuration modules used across the application.

## Backblaze B2 (`backblaze.ts`)

Centralized configuration and client for Backblaze B2 cloud storage.

### Features

- **Singleton S3 Client**: Reusable S3-compatible client for B2
- **Configuration Validation**: Check if B2 is properly configured
- **URL Building**: Generate CDN URLs for uploaded media
- **Environment Variables**: Safely access B2 configuration

### Usage

```typescript
import { 
  isB2Configured, 
  getB2ClientSingleton, 
  getB2BucketName,
  buildMediaUrl 
} from '@/lib/backblaze';

// Check if B2 is configured
if (isB2Configured()) {
  // Get the B2 client
  const client = getB2ClientSingleton();
  const bucket = getB2BucketName();
  
  // Use the client for operations
  // ... upload/download logic
  
  // Build media URL
  const url = buildMediaUrl('my-file.jpg');
}
```

### Required Environment Variables

```env
BACKBLAZE_KEY_ID=your_key_id
BACKBLAZE_APPLICATION_KEY=your_application_key
BACKBLAZE_BUCKET_NAME=lgfc-media-production
BACKBLAZE_ENDPOINT=s3.us-west-004.backblazeb2.com
NEXT_PUBLIC_MEDIA_CDN_URL=https://f004.backblazeb2.com/file/lgfc-media-production
```

### API Endpoints Using B2

- `/api/upload` - File upload endpoint using B2 storage
- `/api/b2-status` - Check B2 configuration status

### Testing

To test the B2 connection status:

```bash
curl http://localhost:3000/api/b2-status
```

Response:
```json
{
  "configured": true,
  "bucketName": "lgfc-media-production",
  "cdnBaseUrl": "https://f004.backblazeb2.com/file/lgfc-media-production",
  "message": "Backblaze B2 is properly configured"
}
```
