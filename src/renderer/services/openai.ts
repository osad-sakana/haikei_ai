import { Electron, mockElectron } from '../types';
import { apiKeyManager } from './apiKeyManager';
import { createAppError, getErrorMessage } from '../utils/errorHandler';

const electron: Electron = window.electron || mockElectron;

interface OpenAIConfig {
  apiKey: string;
  model: string;
}

interface OpenAIPrompt {
  role: 'system' | 'user';
  content: string;
}

/**
 * OpenAIサービス
 * APIキーの管理とテキスト生成を担当
 */
class OpenAIService {
  private config: OpenAIConfig = {
    apiKey: '',
    model: 'gpt-4o-mini',
  };

  constructor() {
    this.loadConfig();
  }

  /**
   * 設定を読み込む
   */
  private async loadConfig() {
    try {
      const savedApiKey = await apiKeyManager.getApiKey();
      if (savedApiKey) {
        this.config.apiKey = savedApiKey;
      }
    } catch (error) {
      console.error('Failed to load OpenAI config:', error);
    }
  }

  /**
   * APIキーを設定する
   * @param apiKey - 設定するAPIキー
   */
  public async setApiKey(apiKey: string) {
    try {
      await apiKeyManager.saveApiKey(apiKey);
      this.config.apiKey = apiKey;
    } catch (error) {
      const appError = createAppError(error);
      console.error('Failed to set API key:', appError);
      throw new Error(getErrorMessage(appError));
    }
  }

  /**
   * テキストを生成する
   * @param prompts - プロンプトの配列
   * @returns 生成されたテキスト
   */
  public async generateText(prompts: OpenAIPrompt[]): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is not set');
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: this.config.model,
            messages: prompts,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        return await electron.openai.generateText(prompts);
      }
    } catch (error) {
      const appError = createAppError(error);
      console.error('OpenAI API error:', appError);
      throw new Error(getErrorMessage(appError));
    }
  }
}

export const openAIService = new OpenAIService(); 