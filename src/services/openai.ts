import OpenAI from 'openai';
import Store from 'electron-store';

const store = new Store();

const getApiKey = (): string => {
  const apiKey = store.get('apiKey') as string;
  if (!apiKey) {
    throw new Error('APIキーが設定されていません');
  }
  return apiKey;
};

const createOpenAIApi = () => {
  return new OpenAI({
    apiKey: getApiKey(),
  });
};

export const summarizeMail = async (content: string): Promise<string> => {
  const openai = createOpenAIApi();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'あなたはメールの要約を専門とするAIアシスタントです。与えられたメールの内容を簡潔に要約してください。',
      },
      {
        role: 'user',
        content,
      },
    ],
  });

  return response.choices[0]?.message?.content || '要約の生成に失敗しました';
};

export const convertStyle = async (text: string): Promise<string> => {
  const openai = createOpenAIApi();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'あなたは日本語の文体を変換するAIアシスタントです。与えられたテキストを日本の伝統的なメール形式に変換してください。',
      },
      {
        role: 'user',
        content: text,
      },
    ],
  });

  return response.choices[0]?.message?.content || '文体の変換に失敗しました';
}; 