export interface ElectronStore {
  get: (key: string) => any;
  set: (key: string, val: any) => void;
  delete: (key: string) => void;
  clear: () => void;
}

export interface Electron {
  summarizeMail: (content: string) => Promise<string>;
  convertStyle: (text: string) => Promise<string>;
  store: ElectronStore;
}

declare global {
  interface Window {
    electron?: Electron;
  }
} 