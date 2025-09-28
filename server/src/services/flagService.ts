import crypto from 'crypto';

class FlagService {
  private static flag: string | null = null;

  /**
   * Get the flag from environment variable or generate a static one
   */
  static getFlag(): string {
    if (!this.flag) {
      // Use dynamic flag from environment variable if available
      const envFlag = process.env.FLAG;
      if (envFlag) {
        this.flag = envFlag;
      } else {
        // Fallback to static flag for local development
        const randomBytes = crypto.randomBytes(16); // 16 bytes = 32 hex characters
        this.flag = `FlagY{${randomBytes.toString('hex')}}`;
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
