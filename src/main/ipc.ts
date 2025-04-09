import { ipcMain } from 'electron';
import { summarizeMail, convertStyle } from '../services/openai';

export const setupIpcHandlers = () => {
  ipcMain.handle('summarize-mail', async (_, content: string) => {
    try {
      return await summarizeMail(content);
    } catch (error) {
      console.error('メール要約エラー:', error);
      throw error;
    }
  });

  ipcMain.handle('convert-style', async (_, text: string) => {
    try {
      return await convertStyle(text);
    } catch (error) {
      console.error('文体変換エラー:', error);
      throw error;
    }
  });
}; 