import keytar from 'keytar';

const SERVICE_NAME = 'haikei-ai';
const ACCOUNT_NAME = 'openai-api-key';

/**
 * APIキー管理サービス
 */
class ApiKeyManager {
  /**
   * APIキーを保存する
   * @param apiKey - 保存するAPIキー
   */
  async saveApiKey(apiKey: string): Promise<void> {
    try {
      await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, apiKey);
    } catch (error) {
      console.error('Failed to save API key:', error);
      throw new Error('APIキーの保存に失敗しました');
    }
  }

  /**
   * 保存されたAPIキーを取得する
   * @returns 保存されたAPIキー、存在しない場合はnull
   */
  async getApiKey(): Promise<string | null> {
    try {
      return await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    } catch (error) {
      console.error('Failed to get API key:', error);
      throw new Error('APIキーの取得に失敗しました');
    }
  }

  /**
   * 保存されたAPIキーを削除する
   */
  async deleteApiKey(): Promise<void> {
    try {
      await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
    } catch (error) {
      console.error('Failed to delete API key:', error);
      throw new Error('APIキーの削除に失敗しました');
    }
  }
}

export const apiKeyManager = new ApiKeyManager(); 