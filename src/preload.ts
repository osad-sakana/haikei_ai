import { contextBridge, ipcRenderer } from 'electron';
import Store from 'electron-store';

// 電子ストアの初期化
const store = new Store();

// Electronの機能をウィンドウオブジェクトに公開
contextBridge.exposeInMainWorld('electron', {
  // OpenAI API関連
  summarizeMail: (content: string) => ipcRenderer.invoke('summarize-mail', content),
  convertStyle: (text: string) => ipcRenderer.invoke('convert-style', text),
  
  // 電子ストア関連
  store: {
    get: (key: string) => store.get(key),
    set: (key: string, val: any) => store.set(key, val),
    delete: (key: string) => store.delete(key),
    clear: () => store.clear(),
  }
});

// ページ読み込み完了時にメインプロセスに通知
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded in preload');
}); 