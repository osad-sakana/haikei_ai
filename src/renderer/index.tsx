import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}); 