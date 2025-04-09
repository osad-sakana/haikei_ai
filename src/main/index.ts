import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';
import fetch from 'node-fetch';

const store = new Store();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// APIキーの保存と取得
ipcMain.handle('get-api-key', async () => {
  return store.get('apiKey');
});

ipcMain.handle('set-api-key', async (_, apiKey: string) => {
  store.set('apiKey', apiKey);
});

// メール要約API
ipcMain.handle('summarize-mail', async (_, content: string) => {
  const apiKey = store.get('apiKey') as string;
  if (!apiKey) {
    throw new Error('APIキーが設定されていません');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'あなたはメールの要約を専門とするAIアシスタントです。与えられたメールの内容を簡潔に要約してください。'
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'APIリクエストに失敗しました');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('APIリクエストエラー:', error);
    throw error;
  }
});

// 文体変換API
ipcMain.handle('convert-style', async (_, content: string) => {
  const apiKey = store.get('apiKey') as string;
  if (!apiKey) {
    throw new Error('APIキーが設定されていません');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'あなたは文体変換を専門とするAIアシスタントです。与えられたテキストを丁寧なビジネス文書の文体に変換してください。'
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'APIリクエストに失敗しました');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('APIリクエストエラー:', error);
    throw error;
  }
}); 