import * as fs from 'fs';
import * as path from 'path';

export class DownloadCleanup {
  private static downloadsDir = './playwright-downloads';

  /**
   * Ensure downloads directory exists
   */
  static async ensureDownloadsDir(): Promise<void> {
    if (!fs.existsSync(this.downloadsDir)) {
      fs.mkdirSync(this.downloadsDir, { recursive: true });
    }
  }

  /**
   * Clean up a specific downloaded file
   */
  static async cleanupFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up downloaded file: ${filePath}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not delete file ${filePath}:`, error);
    }
  }

  /**
   * Clean up all files in the downloads directory
   */
  static async cleanupAllDownloads(): Promise<void> {
    try {
      if (fs.existsSync(this.downloadsDir)) {
        const files = fs.readdirSync(this.downloadsDir);
        for (const file of files) {
          const filePath = path.join(this.downloadsDir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        }
        if (files.length > 0) {
          console.log(`Cleaned up ${files.length} files from downloads directory`);
        }
      }
    } catch (error) {
      console.warn('Warning: Could not clean up downloads directory:', error);
    }
  }

  /**
   * Verify a downloaded file exists and has content
   */
  static async verifyDownload(filePath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }
      const stats = fs.statSync(filePath);
      return stats.size > 0;
    } catch (error) {
      console.warn(`Error verifying download ${filePath}:`, error);
      return false;
    }
  }
} 