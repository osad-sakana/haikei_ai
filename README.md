# Haikei AI

AIを活用したメール要約・文体変換アプリケーション

## 機能

- メール本文の要約生成
- テキストのビジネスメール形式への変換
- OpenAI APIを使用した高度な自然言語処理

## 必要条件

- Node.js 18以上
- npm または yarn
- OpenAI APIキー

## インストール

1. リポジトリをクローン
```bash
git clone https://github.com/osad-sakana/haikei_ai.git
cd haikei_ai
```

2. 依存関係のインストール
```bash
npm install
```

## 使用方法

1. 開発サーバーの起動
```bash
npm run dev
```

2. アプリケーションのビルド
```bash
npm run build
```

3. アプリケーションの起動
```bash
npm start
```

4. APIキーの設定
- アプリケーション起動後、設定画面からOpenAI APIキーを入力
- APIキーは安全に保存され、次回起動時も保持されます

## エラーハンドリング

アプリケーションは以下のエラーを適切に処理します：

- APIエラー：APIキーが無効または設定されていない場合
- ネットワークエラー：インターネット接続に問題がある場合
- バリデーションエラー：入力が不正な場合
- その他の予期せぬエラー

エラーが発生した場合は、ユーザーフレンドリーなメッセージが表示されます。

## コンポーネント

### MailSummary
メール本文を入力すると、AIを使用して要約を生成します。

### StyleConverter
入力されたテキストをビジネスメール形式に変換します。

### Settings
OpenAI APIキーの設定と管理を行います。

## 技術スタック

- Electron
- React
- TypeScript
- Material-UI
- OpenAI API

## ライセンス

MIT

## 貢献

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成 