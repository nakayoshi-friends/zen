# zen

slack 上で zen を送り合うことができます
TypeScript, Firestore, Cloud Functions, および Slack API を使用して開発されています。

## 開発環境のセットアップ

1. 必要な依存関係をインストールします:

   ```
   npm install
   ```

2. Firestore と Cloud Functions の設定を行います:
   - Firebase コンソールからプロジェクトを設定し、必要な認証情報を取得します。

## **使用可能な npm スクリプト**

- **Start Emulator:**

  ```arduino
  arduinoCopy code
  npm run shell

  ```

  開発用のローカル Cloud Functions エミュレータを起動します。

- **Deploy:**

  ```arduino
  arduinoCopy code
  npm run build && firebase deploy --only functions

  ```

  ビルドを実行した後、Cloud Functions をデプロイします。

- **Logs:**

  ```bash
  bashCopy code
  firebase functions:log

  ```

  Cloud Functions のログを表示します。

- **Emulator:**

  ```wasm
  wasmCopy code
  npm run build && firebase emulators:start --import=data/v0 --export-on-exit

  ```

  Firestore エミュレータを含むすべてのエミュレータを起動し、開始時にデータをインポートし、終了時にエクスポートします。

## **開発時の注意**

- **Visual Studio Code:**
  開発中は Visual Studio Code で作業を行うことをお勧めします。TypeScript の設定 (**`tsconfig.json`**) に関連するエラーが発生する可能性がありますが、VS Code ではこれらの問題が自動的に解決されることが多いです。

## **デプロイ**

- Firebase CLI を使用して、構築した機能を Firebase にデプロイします。上記の **`deploy`** スクリプトを使用してください。
