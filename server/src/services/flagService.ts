import crypto from 'crypto';

class FlagService {
  private static flag: string | null = null;

  /**
   * Generate a random 64-character hex flag
   */
  static generateFlag(): string {
    if (!this.flag) {
      const randomBytes = crypto.randomBytes(16); // 16 bytes = 32 hex characters
      this.flag = `FLAG{${randomBytes.toString('hex')}}`;
    }
    return this.flag;
  }

  /**
   * Get the current flag (generate if not exists)
   */
  static getFlag(): string {
    return this.generateFlag();
  }

  /**
   * Reset the flag (for testing purposes)
   */
  static resetFlag(): void {
    this.flag = null;
  }
}

export default FlagService;
