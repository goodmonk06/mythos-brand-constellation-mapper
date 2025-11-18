/**
 * Storage Adapter Interface
 *
 * Handles file/image storage for content pieces and visual assets.
 */

export interface StoredFile {
  key: string
  url: string
  size: number
  contentType: string
}

export interface StorageAdapter {
  /**
   * Upload a file
   */
  upload(
    key: string,
    data: Buffer | ReadableStream,
    contentType: string
  ): Promise<StoredFile>

  /**
   * Download a file
   */
  download(key: string): Promise<Buffer>

  /**
   * Delete a file
   */
  delete(key: string): Promise<void>

  /**
   * Get public URL for a file
   */
  getUrl(key: string): Promise<string>

  /**
   * List files with prefix
   */
  list(prefix: string): Promise<StoredFile[]>
}

/**
 * No-Op Storage Adapter
 */
export class NoOpStorageAdapter implements StorageAdapter {
  async upload(): Promise<StoredFile> {
    throw new Error('Storage not configured')
  }

  async download(): Promise<Buffer> {
    throw new Error('Storage not configured')
  }

  async delete(): Promise<void> {
    throw new Error('Storage not configured')
  }

  async getUrl(key: string): Promise<string> {
    return `/placeholder/${key}`
  }

  async list(): Promise<StoredFile[]> {
    return []
  }
}

/**
 * Local Storage Adapter (for development)
 */
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private basePath: string = './uploads') {}

  async upload(
    key: string,
    data: Buffer | ReadableStream,
    contentType: string
  ): Promise<StoredFile> {
    // TODO: Implement local file system storage
    return {
      key,
      url: `/uploads/${key}`,
      size: 0,
      contentType,
    }
  }

  async download(key: string): Promise<Buffer> {
    // TODO: Implement local file system download
    return Buffer.from('')
  }

  async delete(key: string): Promise<void> {
    // TODO: Implement local file system delete
  }

  async getUrl(key: string): Promise<string> {
    return `/uploads/${key}`
  }

  async list(prefix: string): Promise<StoredFile[]> {
    // TODO: Implement local file system list
    return []
  }
}

/**
 * S3 Storage Adapter (stub)
 */
export class S3StorageAdapter implements StorageAdapter {
  constructor(
    private bucket: string,
    private region: string,
    private accessKeyId: string,
    private secretAccessKey: string
  ) {}

  async upload(
    key: string,
    data: Buffer | ReadableStream,
    contentType: string
  ): Promise<StoredFile> {
    // TODO: Implement S3 upload using AWS SDK
    return {
      key,
      url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
      size: 0,
      contentType,
    }
  }

  async download(key: string): Promise<Buffer> {
    // TODO: Implement S3 download
    return Buffer.from('')
  }

  async delete(key: string): Promise<void> {
    // TODO: Implement S3 delete
  }

  async getUrl(key: string): Promise<string> {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
  }

  async list(prefix: string): Promise<StoredFile[]> {
    // TODO: Implement S3 list
    return []
  }
}

// Factory function
export function createStorageAdapter(): StorageAdapter {
  const s3Bucket = process.env.S3_BUCKET
  const s3Region = process.env.S3_REGION
  const s3AccessKey = process.env.S3_ACCESS_KEY_ID
  const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY

  if (s3Bucket && s3Region && s3AccessKey && s3SecretKey) {
    return new S3StorageAdapter(s3Bucket, s3Region, s3AccessKey, s3SecretKey)
  }

  if (process.env.NODE_ENV === 'development') {
    return new LocalStorageAdapter()
  }

  return new NoOpStorageAdapter()
}
