import { Electron, mockElectron } from '../types';

const electron: Electron = window.electron || mockElectron;

interface OpenAIConfig {
  apiKey: string;
  model: string;
}

interface OpenAIPrompt {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class OpenAIService {
  private config: OpenAIConfig = {
    apiKey: '',
    model: 'gpt-3.5-turbo',
  };

  constructor() {
    this.loadConfig();
  }

  private async loadConfig() {
    try {
      const savedApiKey = await electron.store.get('openaiApiKey');
      if (savedApiKey) {
        this.config.apiKey = savedApiKey;
      }
    } catch (error) {
      console.error('Failed to load OpenAI config:', error);
    }
  }

  public async setApiKey(apiKey: string) {
    this.config.apiKey = apiKey;
    await electron.store.set('openaiApiKey', apiKey);
  }

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
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

export const openAIService = new OpenAIService(); 