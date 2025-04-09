export interface Electron {
  store: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
  summarizeMail: (content: string) => Promise<string>;
  convertStyle: (content: string) => Promise<string>;
}

// 開発モード用のモック
export const mockElectron: Electron = {
  store: {
    get: async (key: string) => {
      console.log('Mock: Getting', key);
      return localStorage.getItem(key);
    },
    set: async (key: string, value: any) => {
      console.log('Mock: Setting', key, value);
      localStorage.setItem(key, value);
    },
  },
  summarizeMail: async (content: string) => {
    console.log('Mock: Summarizing mail', content);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('これは開発モード用のサンプル要約です。\n\n' + 
          '1. メールの主な内容\n' +
          '2. 重要なポイント\n' +
          '3. アクションアイテム\n\n' +
          '実際のAPIが接続されると、より詳細な要約が表示されます。');
      }, 1000);
    });
  },
  convertStyle: async (content: string) => {
    console.log('Mock: Converting style', content);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('これは開発モード用のサンプル変換結果です。\n\n' +
          '入力されたテキストを丁寧なビジネス文書の文体に変換した結果が表示されます。\n' +
          '実際のAPIが接続されると、より自然な変換結果が表示されます。');
      }, 1000);
    });
  },
}; 