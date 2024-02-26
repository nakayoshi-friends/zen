// Cloud FunctionsでFirestoreのタイムスタンプ取得した時に日本時間で扱うために必要
process.env.TZ = 'Asia/Tokyo';

// デプロイ確認用テストapi
export * from './api/test';
export * from './api/testModal';
