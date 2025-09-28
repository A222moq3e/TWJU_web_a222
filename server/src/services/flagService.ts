import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

class FlagService {
  private static flag: string | null = null;

  /**
   * Get the flag from environment or flag file
   */
  static getFlag(): string {
    if (!this.flag) {
      // First try to get from environment variable
      if (process.env.FLAG) {
        this.flag = process.env.FLAG;
      } else {
        // Try to read from flag file
        try {
          const flagPath = path.join(process.cwd(), '..', 'flag.txt');
          if (fs.existsSync(flagPath)) {
            this.flag = fs.readFileSync(flagPath, 'utf8').trim();
          }
        } catch (error) {
          // Fallback to generating a flag if neither environment nor file exists
          const randomBytes = crypto.randomBytes(16);
          this.flag = `FLAG{${randomBytes.toString('hex')}}`;
        }
      }
    }
    return this.flag;
  }

  /**
   * Reset the flag (for testing purposes)
   */
  static resetFlag(): void {
    this.flag = null;
  }
}

export default FlagService;
